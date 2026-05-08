import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream py-12 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link href="/" className="font-display text-2xl font-black tracking-tight mb-4 inline-block">
            <span className="text-white">Toy</span>
            <span className="text-yellow">Box</span>
          </Link>
          <p className="text-gray-400 text-sm">
            Premium toys for kids of all ages. Spark imagination and creativity.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold mb-4 text-white">Shop</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/?category=action-figures" className="hover:text-yellow transition-colors">Action Figures</Link></li>
            <li><Link href="/?category=building-blocks" className="hover:text-yellow transition-colors">Building Blocks</Link></li>
            <li><Link href="/?category=educational" className="hover:text-yellow transition-colors">Educational</Link></li>
            <li><Link href="/?category=board-games" className="hover:text-yellow transition-colors">Board Games</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-4 text-white">Account</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/auth/login" className="hover:text-yellow transition-colors">Login</Link></li>
            <li><Link href="/auth/register" className="hover:text-yellow transition-colors">Register</Link></li>
            <li><Link href="/orders" className="hover:text-yellow transition-colors">Track Order</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-4 text-white">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>hello@toybox.com</li>
            <li>1-800-TOY-BOX1</li>
            <li>123 Play Street, Fun City</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-gray-700 text-sm text-center text-gray-500">
        &copy; {new Date().getFullYear()} ToyBox. All rights reserved.
      </div>
    </footer>
  );
}
