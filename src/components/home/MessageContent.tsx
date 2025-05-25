import { Message } from "@/services/messageService";
import Image from "next/image";

interface MessageContentProps {
  message: Message;
}

export default function MessageContent({ message }: MessageContentProps) {
  // Helper to determine message content type and render appropriate element
  if (message.content.startsWith("[IMG:")) {
    // Display image
    return (
      <div className="mt-1">
        <Image
          src={message.content.substring(5, message.content.length - 1)}
          alt="Shared image"
          className="max-w-full rounded-md"
          width={300}
          height={300}
          style={{ maxHeight: "300px", objectFit: "contain" }}
        />
      </div>
    );
  } else if (message.content.startsWith("[VIDEO:")) {
    // Display video
    return (
      <div className="mt-1">
        <video
          src={message.content.substring(7, message.content.length - 1)}
          controls
          className="max-w-full rounded-md"
          style={{ maxHeight: "300px" }}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  } else if (message.content.startsWith("[AUDIO:")) {
    // Display audio
    return (
      <div className="mt-1">
        <audio
          src={message.content.substring(7, message.content.length - 1)}
          controls
          className="max-w-full"
        >
          Your browser does not support the audio tag.
        </audio>
      </div>
    );
  } else if (message.content.startsWith("[FILE:")) {
    // Display file link
    return (
      <div className="mt-1">
        <a
          href={message.content.substring(6, message.content.indexOf("]"))}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center ${
            message.isMine ? "text-white" : "text-blue-600"
          } hover:underline`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          {message.content.substring(message.content.indexOf("]") + 1)}
        </a>
      </div>
    );
  } else {
    // Regular text message
    return (
      <p
        className={`font-medium text-base ${
          message.isMine ? "text-white" : "text-black"
        }`}
      >
        {message.content}
      </p>
    );
  }
}
