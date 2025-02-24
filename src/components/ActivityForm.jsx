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
import { useAuthState, useDbUpdate } from "../hooks/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ActivityForm = ({ onSuccess }) => {
  const [user] = useAuthState();
  const [updateData] = useDbUpdate(
    user ? `users/${user.uid}/activities` : null,
  );

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

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
    const location = formData.get("location");
    const groupSize = formData.get("groupSize");
    const eventTimestamp = formData.get("eventTimestamp");

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
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder="Give your activity a short title"
          required
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="What is your activity about?"
          required
        />
      </div>

      {/* Location */}
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          type="text"
          placeholder="Where will this activity take place?"
          required
        />
      </div>

      {/* Group Size + Tooltip */}
      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Label htmlFor="groupSize">Maximum Group Size</Label>
            </TooltipTrigger>
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
          placeholder="How many total people can join?"
          required
        />
      </div>

      {/* Event Date/Time */}
      <div>
        <Label htmlFor="eventTimestamp">Event Date & Time</Label>
        <Input
          id="eventTimestamp"
          name="eventTimestamp"
          type="datetime-local"
          required
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" variant="default">
        Post Activity
      </Button>
    </form>
  );
};

export default ActivityForm;
