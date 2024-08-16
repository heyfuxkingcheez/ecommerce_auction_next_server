import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faBlogger } from '@fortawesome/free-brands-svg-icons';
import { faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  return (
    <footer className="bg-white text-black py-6">
      <div className="container mx-auto text-center">
        <div className="mb-4">
          <a
            href="https://github.com/heyfuxkingcheez/ecommerce_auction_db_server"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-gray-700 mx-3"
          >
            <FontAwesomeIcon icon={faGithub} className="mr-2" />
            GitHub
          </a>
          <a
            href="https://velog.io/@jgw987/posts"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-gray-700 mx-3"
          >
            <FontAwesomeIcon icon={faBlogger} className="mr-2" />
            Blog
          </a>
          <a
            href="https://roasted-crush-68f.notion.site/364d31141e0a42b6952cfc3b3ed96eec?pvs=4"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-gray-700 mx-3"
          >
            <FontAwesomeIcon icon={faBlogger} className="mr-2" />
            Brochure
          </a>
        </div>
        <div className="mb-4">
          <p className="text-black">
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            정기욱
          </p>
        </div>
        <div>
          <p className="text-black">
            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
            010-8188-1282
          </p>
        </div>
      </div>
    </footer>
  );
}
