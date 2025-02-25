import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const ActivityForm = ({ onSuccess }) => {
  const [user] = useAuthState();
  const [updateData] = useDbUpdate(
    user ? `users/${user.uid}/activities` : null,
  );
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [activityLocation, setActivityLocation] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

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
    const coords = [activityLocation.x, activityLocation.y];
    const groupSize = formData.get("groupSize");
    const eventTimestamp = formData.get("eventTimestamp");

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

    const selectedDate = new Date(eventTimestamp);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      validationErrors.eventTimestamp = "Date must be today or later.";
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
          `activities/${user.uid}/${Date.now()}_${image.name}`,
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
      [Date.now()]: {
        title,
        description,
        location,
        coords,
        groupSize: parseInt(groupSize, 10),
        eventTimestamp,
        creationTimestamp: Date.now(),
        posterUid: user.uid,
        imageUrl,
      },
    });

    console.log("Activity posted successfully!");

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image Upload */}
      <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-100">
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
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
      <div>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <Textarea
          id="description"
          name="description"
          placeholder="Description"
          required
        />
      </div>

      {/* Location */}
      <div>
        <MapContainer
          center={location?.coords || [42.056, -87.6755]}
          zoom={17}
          className="h-128"
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
      <div>
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
        />
      </div>

      {/* Event Date/Time */}
      <div>
        <Input
          id="eventTimestamp"
          name="eventTimestamp"
          type="datetime-local"
          min={new Date().toISOString().slice(0, 16)}
          required
        />
        {errors.eventTimestamp && (
          <p className="text-red-500 text-sm">{errors.eventTimestamp}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="bg-orange-400 text-white font-crimson text-xl py-5 px-8 rounded-lg hover:bg-orange-500 transition w-3/4 mx-auto flex items-center justify-center"
        disabled={uploading}
      >
        Create
      </Button>
    </form>
  );
};

export default ActivityForm;
