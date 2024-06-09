// app/layout.js
import './globals.css';
import Provider from '../components/SessionProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <div className="container">
            <header>
              <nav>
                <ul>
                  <li><a href="/">Home</a></li>
                  <li><a href="/auth">Auth</a></li>
                </ul>
              </nav>
            </header>
            <main>{children}</main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
