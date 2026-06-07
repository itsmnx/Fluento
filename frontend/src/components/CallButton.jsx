import { VideoIcon } from "lucide-react";

function CallButton({ handleVideoCall }) {
  return (
    <div className="px-3 py-2 shrink-0">
      <button
        type="button"
        onClick={handleVideoCall}
        className="btn btn-success btn-sm gap-2"
        title="Start video call"
      >
        <VideoIcon className="size-4" />
        Video Call
      </button>
    </div>
  );
}

export default CallButton;