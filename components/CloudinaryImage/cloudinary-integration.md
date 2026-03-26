# Set Up the Cloudinary Plugin

Use the Builder.io Cloudinary plugin to integrate the official Cloudinary Media Library widget into the visual editor, letting content editors browse and insert images directly.

## Preparing Your Cloudinary Credentials

1. Go to your [Cloudinary Console](https://console.cloudinary.com/).
2. Navigate to **Settings** > **API Keys**.
3. Here you will be able to find your **Cloud Name** and **API Key** which we'll need later.

## Installing the Plugin in Builder

1. In Builder, go to the **Plugins** tab.
2. Enable the **Cloudinary** plugin.

The plugin adds a `cloudinaryImageEditor` input type you can use in any custom component.

## Registering a Custom Component

Register a component with a `cloudinaryImageEditor` input type so editors can pick Cloudinary images. For details on custom component setup, see [Custom Components Setup](https://www.builder.io/c/docs/custom-components-setup).

Here's an example of custom component configs for the Gen 2 SDK.

```ts
import type { RegisteredComponent } from "@builder.io/sdk-react";

export const cloudinaryImageConfig: RegisteredComponent = {
  component: CloudinaryImage, // Your custom Cloudinary Component
  name: "Cloudinary Assets",
  inputs: [
    { name: "cloudinaryOptions", type: "cloudinaryImageEditor" },
  ],
};
```

## Using the Plugin in the Visual Editor

1. Add a custom component that has a `cloudinaryImageEditor` input type to your page.
2. Drag that component into any page and click the component to setup credentials.
3. Click **Set Credentials** and enter your **Cloud Name** and **API Key** which we attained from an earlier step.
4. Click **Save**.
5. Click **Choose Image** to launch the Cloudinary Media Library browser.
6. Select a single image and click **Insert**.


## Cloudinary Asset Payload

Here's a sample JSON that is passed to your component when an editor selects an image. [Cloudinary docs](https://cloudinary.com/documentation/media_library_widget#sample_json_response_for_a_transformed_image):

```json
{
  "public_id": "sample",
  "resource_type": "image",
  "type": "upload",
  "format": "jpg",
  "version": 1511474034,
  "url": "http://res.cloudinary.com/demo/image/upload/v1511474034/sample.jpg",
  "secure_url": "https://res.cloudinary.com/demo/image/upload/v1511474034/sample.jpg",
  "width": 864,
  "height": 576,
  "bytes": 120257,
  "duration": null,
  "tags": [],
  "metadata": [],
  "created_at": "2023-02-08T08:38:51Z",
  "derived": [
    {
      "url": "http://res.cloudinary.com/demo/image/upload/c_scale,e_grayscale,f_auto,q_auto,w_100/v1511474034/sample.jpg",
      "secure_url": "https://res.cloudinary.com/demo/image/upload/c_scale,e_grayscale,f_auto,q_auto,w_100/v1511474034/sample.jpg"
    }
  ],
  "access_mode": "public",
  "access_control": [],
  "created_by": {
    "type": "user",
    "id": "abc123def456ghiabc123def456ghi"
  },
  "uploaded_by": {
    "type": "user",
    "id": "xyz789efg456qrsxyz789efg456qrs"
  },
  "id": "ede59e6d3befdc65a8adc2f381c0f96f",
  "folder_id": "abcs432p8xyz0q532wqpoirnk0138",
  "context": {
    "custom": {
      "alt": "Text that describes the image",
      "caption": "Caption or title that is presented along with the image"
    }
  }
}
```
