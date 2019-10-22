import Link from 'next/link'
import { H4 } from '~/components/text'
import { Image } from '~/components/media'

export default function({ quickstart, icons, href, deployUrl }) {
  return (
    <div className="quickstart">
      <Link href={href}>
        <a>
          <span className="quickstart-icons">
            {Array.isArray(icons) ? (
              icons.map(icon =>
                typeof icon === 'object' ? (
                  <span key={icon.src} style={{ backgroundColor: icon.color }}>
                    <img alt={`Icon for ${quickstart}`} src={icon.src} />
                  </span>
                ) : (
                  <img alt={`Icon for ${quickstart}`} key={icon} src={icon} />
                )
              )
            ) : typeof icons === 'object' ? (
              <span style={{ backgroundColor: icons.color }}>
                <img alt={`Icon for ${quickstart}`} src={icons.src} />
              </span>
            ) : (
              <img alt={`Icon for ${quickstart}`} src={icons} />
            )}
          </span>
          <H4>{quickstart}</H4>
          <span className="note">Read the guide</span>
          {deployUrl && (
            <a href={deployUrl} className="deploy-button">
              <Image
                src="https://zeit.co/button"
                width={104}
                height={36}
                align="left"
              />
            </a>
          )}
        </a>
      </Link>
      <style jsx>{`
        .quickstart > :global(a) {
          border-radius: 4px;
          border: 1px solid var(--accents-2);
          color: var(--accents-6);
          padding: 24px;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.1s ease, border 0.1s ease;
          text-decoration: none;
        }

        .quickstart > :global(a:hover) {
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.12);
          border-color: transparent;
        }

        .quickstart .deploy-button {
          margin-top: 24px;
        }

        .quickstart :global(figure) {
          margin: 0;
        }

        .quickstart-icons {
          display: flex;
          width: 100%;
        }

        .quickstart :global(a:hover h4) {
          color: var(--geist-link-color);
        }

        .quickstart :global(h4) {
          margin-bottom: 8px;
          margin-top: 24px;
          transition: color 0.1s ease;
        }

        .quickstart-icons span {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-clip: padding-box;
          flex: 0 0 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
        }

        .quickstart-icons > span:not(:last-child),
        .quickstart-icons > img:not(:last-child) {
          margin-right: 8px;
        }

        .quickstart-icons > span img {
          width: 100%;
          max-height: 100%;
        }

        .quickstart-icons > img {
          width: 48px;
          height: 48px;
        }

        .note {
          color: var(--accents-5);
          font-size: var(--font-size-primary);
          line-height: var(--line-height-primary);
        }
      `}</style>
    </div>
  )
}
