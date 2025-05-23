import { Link } from "wouter";

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
          <div className="px-5 py-2">
            <Link href="/about">
              <a className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                About
              </a>
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link href="/help">
              <a className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Help Center
              </a>
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link href="/privacy">
              <a className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Privacy
              </a>
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link href="/terms">
              <a className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Terms
              </a>
            </Link>
          </div>
        </nav>
        <p className="mt-8 text-center text-base text-gray-400">
          &copy; {year} TradeNavigator. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

