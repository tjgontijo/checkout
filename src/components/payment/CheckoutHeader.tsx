import React from 'react';
import Image from 'next/image';
import { Lock } from 'lucide-react';

export const CheckoutHeader: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  // Detecta mobile (tailwind md:breakpoint)
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      <header className="relative z-20 w-full bg-slate-700 border-b border-muted shadow-sm flex items-center justify-center min-h-[74px] px-4">
        {/* Logo centralizada, responsiva */}
        <div className="flex-1 flex justify-center items-center">
          <Image
            src="https://images.yampi.me/assets/stores/prof-didatica/uploads/logo/668e956bf026c.png"
            alt="Logo"
            width={96}
            height={96}
            className="h-16 w-auto object-contain"
            priority
          />
        </div>
        {/* Cadeado canto direito */}
        <button
          type="button"
          aria-label="Ver segurança"
          className="absolute right-4 text-zinc-100 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-muted/60 text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => setOpen(true)}
        >
          <Lock className="h-5 w-5 "/>
        </button>
      </header>
      {/* Modal/Dialog/BottonSheet */}
      {open && (
        isMobile ? (
          // Bottom sheet para mobile
          <div className="fixed inset-0 z-50 flex items-end md:hidden">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <div className="relative w-full bg-white rounded-t-2xl shadow-lg p-6 animate-slide-up">
              <h2 className="text-lg font-bold text-primary mb-2">Sua compra é segura!</h2>
              <p className="text-sm text-gray-700 mb-6">Utilizamos criptografia segura para proteger seus dados durante o processamento, garantindo mais segurança na compra.</p>
              <button
                className="w-full py-2 rounded bg-primary text-white font-medium text-base"
                onClick={() => setOpen(false)}
              >Entendi</button>
            </div>
            <style jsx>{`
              .animate-slide-up {
                animation: slideUp .3s cubic-bezier(.4,0,.2,1);
              }
              @keyframes slideUp {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
              }
            `}</style>
          </div>
        ) : (
          // Dialog centralizado para desktop
          <div className="fixed inset-0 z-50 flex items-center justify-center hidden md:flex">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <div className="relative bg-white rounded-xl shadow-xl p-8 max-w-sm w-full text-center">
              <h2 className="text-lg font-bold text-primary mb-2">Sua compra é segura!</h2>
              <p className="text-sm text-gray-700 mb-6">Utilizamos criptografia segura para proteger seus dados durante o processamento, garantindo mais segurança na compra.</p>
              <button
                className="w-full py-2 rounded bg-primary text-white font-medium text-base"
                onClick={() => setOpen(false)}
              >Entendi</button>
            </div>
          </div>
        )
      )}
    </>
  );
};
