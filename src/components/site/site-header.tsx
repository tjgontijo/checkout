"use client"

import Link from "next/link"
import { 
  Menu, 
  X, 
  CalendarCheck 
} from "lucide-react"
import { useState } from "react"
import { ModeToggle } from '@/components/global/mode-toggle'
import { Button } from '@/components/ui/button'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet'

const NAV_LINKS = [  
  { href: "/#recursos", label: "Recursos" },
  { href: "/#contato", label: "Contato" }
]

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <CalendarCheck className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">SGE</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center space-x-4">
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Button 
            asChild 
            size="sm" 
            className="hidden md:inline-flex bg-primary hover:bg-primary/90"
          >
            <Link href="/auth/signin">
              Acessar Sistema
            </Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                {isMenuOpen ? <X /> : <Menu />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <CalendarCheck className="h-6 w-6 text-primary" />
                  <span>SGE</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-8">
                {NAV_LINKS.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    className="text-sm font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button 
                  asChild 
                  className="w-full bg-primary hover:bg-primary/90 mt-4"
                >
                  <Link href="/auth/signin">
                    Acessar Sistema
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
