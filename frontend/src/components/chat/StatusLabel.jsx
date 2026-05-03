import { Check, CheckCheck, Clock } from "lucide-react";
import { formatRelativeTime } from "../../lib/Utils";

const StatusLabel = ({ message }) => {
  const { status, seenAt, createdAt } = message;

  if (status === "sending") {
    return (
      <span className="flex items-center gap-0.5 text-[10px] text-purple-700 mt-0.5">
        <Clock className="size-2.5" />
        Sending…
      </span>
    );
  }

  if (status === "sent") {
    return (
      <span className="flex items-center gap-0.5 text-[10px] text-purple-700 mt-0.5">
        <Check className="size-2.5" />
        Sent · {formatRelativeTime(createdAt)}
      </span>
    );
  }

  if (status === "delivered") {
    return (
      <span className="flex items-center gap-0.5 text-[10px] text-purple-700 mt-0.5">
        <CheckCheck className="size-2.5 opacity-60" />
        Delivered · {formatRelativeTime(createdAt)}
      </span>
    );
  }

  if (status === "seen") {
    return (
      <span className="flex items-center gap-0.5 text-[10px] text-purple-700 mt-0.5">
        <CheckCheck className="size-2.5" />
        Seen · {formatRelativeTime(seenAt || createdAt)}
      </span>
    );
  }

  return null;
};


export default StatusLabel;