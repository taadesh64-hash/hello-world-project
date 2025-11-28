import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const Navbar = ({ searchQuery, onSearchChange }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-black backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-black text-foreground">
            <span className="text-white">Ani</span><span className="text-orange-500">Verse</span><span className="text-white">Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/browse" className="px-4 py-2 text-foreground hover:text-orange-500 transition-colors border border-border rounded hover:border-orange-500 cursor-pointer">
              Browse
            </Link>
            <Link href="/updates" className="px-4 py-2 text-foreground hover:text-orange-500 transition-colors border border-border rounded hover:border-orange-500 cursor-pointer">
              Updates
            </Link>
            <Link href="/library" className="px-4 py-2 text-foreground hover:text-orange-500 transition-colors border border-border rounded hover:border-orange-500 cursor-pointer">
              Library
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-background focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          {/* Desktop Login */}
          <div className="hidden md:block">
            <Button variant="default" className="bg-orange-500 hover:bg-orange-600 text-white border border-orange-500 rounded cursor-pointer">
              Login
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetTitle>
                <VisuallyHidden>Navigation Menu</VisuallyHidden>
              </SheetTitle>
              <div className="flex flex-col gap-6 mt-8">
                <Link 
                  href="/browse" 
                  className="text-lg text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Browse
                </Link>
                <Link 
                  href="/updates" 
                  className="text-lg text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Updates
                </Link>
                <Link 
                  href="/library" 
                  className="text-lg text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Library
                </Link>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="default" className="w-full">Login</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
