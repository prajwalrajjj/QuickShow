import { assets } from "../assets/assets";
import { profile } from "../lib/profile";

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-36 mt-40 w-full text-gray-300">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-14">
        <div className="md:max-w-96">
          <img className="w-36 h-auto" src={assets.logo} alt={profile.appName} />
          <p className="mt-6 text-sm">
            {profile.appName} is my full-stack movie ticket booking app. Browse movies, pick seats,
            pay securely, and manage bookings — built by {profile.name}.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <a href={profile.github} target="_blank" rel="noreferrer">
              <img src={assets.googlePlay} alt="Google Play" className="h-9 w-auto" />
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              <img src={assets.appStore} alt="App Store" className="h-9 w-auto" />
            </a>
          </div>
        </div>

        <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
          <div>
            <h2 className="font-semibold mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/movies">Movies</a>
              </li>
              <li>
                <a href={profile.github} target="_blank" rel="noreferrer">
                  About me
                </a>
              </li>
              <li>
                <a href={`mailto:${profile.email}`}>Contact</a>
              </li>
              <li>
                <a href={profile.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>{profile.name}</p>
              <a href={`mailto:${profile.email}`} className="hover:text-white">
                {profile.email}
              </a>
              <p>
                <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-white">
                  github.com/{profile.username}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className="pt-4 text-center text-sm pb-5">
        Copyright {new Date().getFullYear()} © {profile.name}. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
