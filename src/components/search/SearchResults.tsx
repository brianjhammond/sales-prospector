import { CrawlResult, SocialProfile } from '@/services/crawler'

interface Props {
  results: CrawlResult[]
}

const SocialProfilesList = ({ profiles }: { profiles: SocialProfile[] }) => (
  <div className="mt-2">
    <h4 className="font-medium text-gray-700">Social Profiles:</h4>
    <ul className="list-disc list-inside">
      {profiles.map((profile, index) => (
        <li key={index} className="ml-2">
          <span className="font-medium">{profile.platform}:</span>
          <ul className="list-none ml-4">
            {profile.urls.map((url, urlIndex) => (
              <li key={urlIndex}>
                <a
                  href={url.startsWith('http') ? url : `https://${url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  </div>
)

export const SearchResults = ({ results }: Props) => {
  return (
    <div className="mt-8 space-y-6">
      {results.map((result, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow">
          {result.error ? (
            <div className="text-red-600">
              Error crawling {result.url}: {result.error}
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold">
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  {result.metadata.title || result.url}
                </a>
              </h3>
              
              <p className="mt-2 text-gray-600">
                {result.metadata.description || 'No description available'}
              </p>

              {result.emails.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700">Email Addresses:</h4>
                  <ul className="list-disc list-inside">
                    {result.emails.map((email, emailIndex) => (
                      <li key={emailIndex} className="ml-2">
                        <a
                          href={`mailto:${email}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {email}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.phoneNumbers.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700">Phone Numbers:</h4>
                  <ul className="list-disc list-inside">
                    {result.phoneNumbers.map((phone, phoneIndex) => (
                      <li key={phoneIndex} className="ml-2">
                        <a
                          href={`tel:${phone}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {phone}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.socialProfiles.length > 0 && (
                <SocialProfilesList profiles={result.socialProfiles} />
              )}

              {result.metadata.ogImage && (
                <div className="mt-4">
                  <img
                    src={result.metadata.ogImage}
                    alt={result.metadata.ogTitle || 'Preview image'}
                    className="max-w-xs rounded"
                  />
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  )
} 