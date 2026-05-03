const NoChatSelected = () => (
  <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 animate-fade-up">
    <div className="text-center space-y-4 max-w-xs px-6">
      <div className="size-20 flex items-center justify-center mx-auto mb-2"
       style={{ 
        animation: "fadeUp 0.5s ease both, softBounce 1.5s ease-in-out infinite"
        }}>
        <img 
           src="/logo_light.png" 
           alt="Vibley" 
           className="h-12 w-auto object-contain"
           onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "block";
          }} />
      </div>
      <h2 className="text-xl font-semibold text-gray-800">Welcome to Vibley</h2>
      <p className="text-gray-400 text-sm leading-relaxed">
        Select a contact from the sidebar to start a conversation
      </p>
    </div>
  </div>
);


export default NoChatSelected;