


export default function DashboardLayout({ children,}: Readonly<{ children: React.ReactNode}>) {
    return (
      <div>
        
        

        {/* main content */}
        <div className="w-full p-4">
         {children}
        </div>
      </div>
    );
  }