const MessageSkeleton = () => (
  <div 
  className="flex-1 
  overflow-y-auto 
  px-4 py-3 
  space-y-3 
  bg-gray-50">
    {Array(6).fill(null).map((_, i) => (
      <div key={i} 
      className={
        `flex items-end gap-2 
        ${i % 2 === 0 ? "" : "flex-row-reverse"}`
        }>
        <div 
        className="skeleton size-7 rounded-full flex-shrink-0" />
        <div 
        className= {
          `skeleton h-12 rounded-2xl 
          ${i % 2 === 0 ? "rounded-bl-sm w-44" : "rounded-br-sm w-36"}`
          } />
      </div>
    ))}
  </div>
);

export default MessageSkeleton;