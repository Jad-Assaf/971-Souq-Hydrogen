import * as React from 'react';
import { Pagination } from '@shopify/hydrogen';
import '../styles/Pagination.css'

export function PaginatedResourceSection({
  connection,
  children,
  resourcesClassName,
}) {
  const observerRef = React.useRef(null);

  React.useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          entry.target.click(); // Trigger click on `NextLink`
        }
      },
      { threshold: 1.0 }
    );

    const nextLinkElement = document.querySelector('.next-link');
    if (nextLinkElement) observerRef.current.observe(nextLinkElement);

    return () => observerRef.current.disconnect();
  }, [connection.pageInfo.endCursor]); // Re-run when the page changes

  return (
    <Pagination connection={connection}>
      {({ nodes, isLoading, PreviousLink, NextLink }) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({ node, index })
        );

        return (
          <div>
            <div className="pagination-buttons">
              <PreviousLink className="pagination-button">
                {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
              </PreviousLink>
            </div>
            {resourcesClassName ? (
              <div className={resourcesClassName}>{resourcesMarkup}</div>
            ) : (
              resourcesMarkup
            )}
            <div className="pagination-buttons">
              <NextLink className="pagination-button next-link">
                {isLoading ? 'Loading...' : <span>Load more ↓</span>}
              </NextLink>
            </div>
          </div>
        );
      }}
    </Pagination>
  );
}