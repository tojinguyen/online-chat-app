// Test file to demonstrate message parsing functionality
// You can run this in the browser console or create a proper test file

import { parseMessageContent } from "@/utils/message-parser";

// Test the parsing function with your example
const testMessage = `[IMG:https://res.cloudinary.com/durc9hj8m/image/upload/v1748444457/chat_files/197aaf8d-920c-4db4-a79a-e4419433e88e.jpg]
[VIDEO:https://res.cloudinary.com/durc9hj8m/video/upload/v1748444471/chat_files/6a1962d1-a891-4aa8-8011-42fe38012084.mp4]
[FILE:https://res.cloudinary.com/durc9hj8m/image/upload/v1748444643/chat_files/8e391be4-9d3b-42bc-8795-386b0a31aa48.pdf]UNITY_DEV_NGUYEN_VAN_TOAI.pdf`;

console.log("Parsed content:", parseMessageContent(testMessage));

// Expected output:
// [
//   { type: 'image', url: 'https://res.cloudinary.com/durc9hj8m/image/upload/v1748444457/chat_files/197aaf8d-920c-4db4-a79a-e4419433e88e.jpg' },
//   { type: 'video', url: 'https://res.cloudinary.com/durc9hj8m/video/upload/v1748444471/chat_files/6a1962d1-a891-4aa8-8011-42fe38012084.mp4' },
//   { type: 'file', url: 'https://res.cloudinary.com/durc9hj8m/image/upload/v1748444643/chat_files/8e391be4-9d3b-42bc-8795-386b0a31aa48.pdf', filename: 'UNITY_DEV_NGUYEN_VAN_TOAI.pdf' }
// ]
