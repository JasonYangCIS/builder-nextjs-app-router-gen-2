import type { RegisteredComponent } from "@builder.io/sdk-react";
import CloudinaryImage from "./CloudinaryImage";

export const cloudinaryImageConfig: RegisteredComponent = {
  component: CloudinaryImage,
  name: "Cloudinary Image",
  inputs: [
    {
      name: "cloudinaryOptions",
      type: "cloudinaryImageEditor",
      helperText: "Select an image from Cloudinary",
    },
    {
      name: "alt",
      type: "string",
      defaultValue: "",
      helperText: "Descriptive alt text for the image (required for accessibility)",
    },
    {
      name: "caption",
      type: "string",
      defaultValue: "",
      helperText: "Optional caption displayed below the image",
    },
    {
      name: "linkUrl",
      type: "url",
      defaultValue: "",
      helperText: "Optional URL — wraps image in a link",
    },
    {
      name: "priority",
      type: "boolean",
      defaultValue: false,
      helperText:
        "Enable for above-the-fold images to preload. Leave off for others.",
    },
    {
      name: "objectFit",
      type: "string",
      enum: ["cover", "contain"],
      defaultValue: "cover",
      helperText: "How the image fills its container",
    },
    {
      name: "rounded",
      type: "boolean",
      defaultValue: false,
      helperText: "Apply border-radius to the image",
    },
  ],
};
