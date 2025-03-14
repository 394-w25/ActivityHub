import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { MapContainer, TileLayer } from "react-leaflet";
import MapSearchField from "@components/MapSearchField";
import { useAuthState, useDbUpdate } from "../hooks/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid4 from "uuid4";
import { useNavigate } from "react-router-dom";

const ActivityForm = ({ onSuccess }) => {
  const [user] = useAuthState();
  const [updateData] = useDbUpdate(
    user ? `users/${user.uid}/hosted_activities` : null,
  );
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [activityLocation, setActivityLocation] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [lookingFor, setLookingFor] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const lookingForOptions = [
    "Friendship",
    "Dating",
    "Meetup",
    "Networking",
    "Group Activity",
    "Other",
  ];
  const availableTags = [
    "Photography",
    "Shopping",
    "Karaoke",
    "Wellness",
    "Cooking",
    "Sports",
    "Outdoor",
    "Swimming",
    "Art & Culture",
    "Traveling",
    "Adventure",
    "Music",
    "Food & Drink",
    "Video Games",
  ];

  const toggleTag = (tag) => {
    setSelectedTags(
      (prevTags) =>
        prevTags.includes(tag)
          ? prevTags.filter((t) => t !== tag) // Remove if already selected
          : [...prevTags, tag], // Add if not selected
    );
  };

  const selectLookingFor = (option) => {
    setLookingFor(option); // Only one option can be selected at a time
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      console.error("User is not signed in.");
      return;
    }

    const formData = new FormData(e.target);
    const title = formData.get("title");
    const description = formData.get("description");
    const location = activityLocation.label;
    const coords = activityLocation.coords;
    const groupSize = formData.get("groupSize");
    const eventStartTimestamp = formData.get("eventStartTimestamp");
    const eventEndTimestamp = formData.get("eventEndTimestamp");

    let validationErrors = {};

    if (!title || title.trim().length === 0) {
      validationErrors.title = "Title is required.";
    } else if (title.length > 50) {
      validationErrors.title = "Title must be less than 50 characters.";
    }

    if (Object.keys(activityLocation).length === 0) {
      validationErrors.location = "Location is required.";
    }

    const parsedGroupSize = parseInt(groupSize, 10);
    if (isNaN(parsedGroupSize) || parsedGroupSize < 1) {
      validationErrors.groupSize =
        "Enter a valid group size (must be a number greater than 0).";
    }

    const startDate = new Date(eventStartTimestamp);
    const endDate = new Date(eventEndTimestamp);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate < today) {
      validationErrors.eventStartTimestamp = "Date must be today or later.";
    }

    if (endDate <= startDate) {
      validationErrors.eventEndTimestamp = "End time must be after start time.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    let imageUrl = null;

    // Upload Image to Firebase Storage
    if (image) {
      setUploading(true);
      try {
        const storage = getStorage();
        const imageRef = ref(
          storage,
          `hosted_activities/${user.uid}/${uuid4()}_${image.name}`,
        );
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setUploading(false);
      }
    }

    updateData({
      // `/users/${user?.uid}/hosted_activities`,
      [uuid4()]: {
        title,
        description,
        location,
        coords,
        groupSize: parseInt(groupSize, 10),
        eventStartTimestamp,
        eventEndTimestamp,
        creationTimestamp: Date.now(),
        posterUid: user.uid,
        imageUrl,
        tags: selectedTags,
        lookingFor,
      },
    });

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-start items-center gap-4 p-4 md:p-6 w-full">
      <ArrowLeft
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 md:top-6 md:left-6 w-6 h-6"
      />
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        {/* Image Upload */}
        <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-100 w-full">
          {imagePreview ? (
            <div className="relative w-full">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-32 md:h-48 object-cover rounded-lg"
              />
              {/* Delete Button */}
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-200"
              >
                &#x2715;
              </button>
            </div>
          ) : (
            <label className="cursor-pointer flex flex-col items-center">
              <span className="text-gray-500 text-sm">Upload Image</span>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Title */}
        <div className="w-full">
          <Input
            id="title"
            name="title"
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div className="w-full">
          <Textarea
            id="description"
            name="description"
            placeholder="Description"
            required
            className="w-full"
          />
        </div>

        {/* Looking For */}
        <div className="w-full">
          <Label>Looking For</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {lookingForOptions.map((option) => (
              <button
                type="button"
                key={option}
                className={`px-3 py-1 border rounded-full text-sm transition ${
                  lookingFor === option
                    ? "bg-orange-400 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => selectLookingFor(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Tags Selection */}
        <div className="w-full">
          <Label>Tags (Select one or more)</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {availableTags.map((tag) => (
              <button
                type="button"
                key={tag}
                className={`px-3 py-1 border rounded-full text-sm transition ${
                  selectedTags.includes(tag)
                    ? "bg-orange-400 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="w-full">
          <MapContainer
            center={location?.coords || [42.056, -87.6755]}
            zoom={17}
            className="h-48 w-full rounded-lg"
          >
            <MapSearchField setActivityLocation={setActivityLocation} />
            <TileLayer
              attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
              url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}.png"
            />
          </MapContainer>
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location}</p>
          )}
        </div>

        {/* Group Size + Tooltip */}
        <div className="w-full">
          <TooltipProvider>
            <Tooltip>
              <TooltipContent>
                <p>Include yourself in this number.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Input
            id="groupSize"
            name="groupSize"
            type="number"
            min="1"
            placeholder="Maximum Group Size"
            required
            className="w-full"
          />
        </div>

        {/* Event Date/Time */}
        <div className="w-full">
          <Label htmlFor="eventStartTimestamp">Start Time</Label>
          <Input
            id="eventStartTimestamp"
            name="eventStartTimestamp"
            type="datetime-local"
            min={new Date().toISOString().slice(0, 16)}
            required
            className="w-full"
          />
        </div>

        <div className="w-full">
          <Label htmlFor="eventEndTimestamp">End Time</Label>
          <Input
            id="eventEndTimestamp"
            name="eventEndTimestamp"
            type="datetime-local"
            min={new Date().toISOString().slice(0, 16)}
            required
            className="w-full"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="bg-orange-400 text-white font-crimson text-xl py-4 px-6 rounded-lg hover:bg-orange-500 transition w-full mx-auto flex items-center justify-center"
          disabled={uploading}
        >
          Create
        </Button>
      </form>
    </div>
  );
};

export default ActivityForm;
