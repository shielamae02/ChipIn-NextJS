const Footer = () => {
  return (
    <footer className='border-t bg-muted/50'>
      <div className='max-w-6xl mx-auto px-4 md:px-6 py-12'>
        <div className='grid gap-8 lg:grid-cols-4'>
          {/* Branding Section */}
          <div className='space-y-4'>
            <div className='flex items-center gap-2 font-bold text-xl'>
              <span className='text-primary'>Chip</span>
              <span>In</span>
            </div>
            <p className='text-sm text-muted-foreground'>
              Making expense splitting simple, fair, and stress-free for
              everyone.
            </p>
          </div>

          {/* Footer Navigation */}
          {[
            {
              title: "Product",
              links: ["Features", "Pricing", "Testimonials", "FAQ"],
            },
            {
              title: "Company",
              links: ["About", "Blog", "Contact", "Careers"],
            },
            {
              title: "Legal",
              links: ["Terms", "Privacy", "Cookies", "Licenses"],
            },
          ].map((section, index) => (
            <div key={index} className='space-y-4'>
              <h3 className='font-medium'>{section.title}</h3>
              <ul className='space-y-2 text-sm'>
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href='#'
                      className='text-muted-foreground hover:text-foreground transition-colors'
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Bottom Section */}
        <div className='mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center'>
          <p className='text-xs text-muted-foreground'>
            © 2025 ChipIn. All rights reserved.
          </p>
          <div className='flex gap-4 mt-4 md:mt-0'>
            {["Terms of Service", "Privacy Policy", "Cookie Policy"].map(
              (item, index) => (
                <a
                  key={index}
                  href='#'
                  className='text-xs text-muted-foreground hover:text-foreground transition-colors'
                >
                  {item}
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
