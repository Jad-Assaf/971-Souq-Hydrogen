import {Await, Link} from '@remix-run/react';
import {Suspense, useId} from 'react';
import {Aside} from '~/components/Aside';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';
import { Footer } from './Footer';

const shopMenuData = [
  { title: "Apple", link: "/collections/apple" },
  { title: "Gaming", link: "/collections/gaming" },
  { title: "Laptops", link: "/collections/laptops" },
  { title: "Desktops", link: "/collections/desktops" },
  { title: "PC Parts", link: "/collections/pc-parts" },
  { title: "Networking", link: "/collections/networking" },
  { title: "Monitors", link: "/collections/monitors" },
  { title: "Mobiles", link: "/collections/mobiles" },
  { title: "Tablets", link: "/collections/tablets" },
  { title: "Audio", link: "/collections/audio" },
  { title: "Accessories", link: "/collections/accessories" },
  { title: "Fitness", link: "/collections/fitness" },
  { title: "Photography", link: "/collections/photography" },
  { title: "Home Appliances", link: "/collections/home-appliances" },
];

const policiesMenuData = [
  { title: "Exchange Policy", link: "/pages/refund-and-warranty-policy" },
  { title: "Shipping Policy", link: "/pages/shipping-policy" },
  { title: "Privacy Policy", link: "/pages/privacy-policy" },
  { title: "Terms of Service", link: "/pages/terms-of-service" },
  { title: "Contact Us", link: "/contact" },
];


/**
 * @param {PageLayoutProps}
 */
export function PageLayout({
  cart,
  children = null,
  header,
  isLoggedIn,
  publicStoreDomain,
  footer, // Add footer as a prop
}) {
  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
        />
      )}
      <main>{children}</main>
      <Footer shopMenu={shopMenuData} policiesMenu={policiesMenuData} />
    </Aside.Provider>
  );
}

/**
 * @param {{cart: PageLayoutProps['cart']}}
 */
function CartAside({cart}) {
  return (
    <Aside type="cart" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchAside() {
  const queriesDatalistId = useId();
  return (
    <Aside type="search" heading="SEARCH">
      <div className="predictive-search">
        <br />
        <SearchFormPredictive>
          {({ fetchResults, goToSearch, inputRef }) => (
            <>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
                list={queriesDatalistId}
              />
              &nbsp;
              <button
                onClick={() => {
                  goToSearch(); // Corrected: Added parentheses to invoke goToSearch
                  closeSearch();
                  setSearchResultsVisible(false);
                }}
              >
                Search
              </button>
            </>
          )}
        </SearchFormPredictive>

        <SearchResultsPredictive>
          {({items, total, term, state, closeSearch}) => {
            const {articles, collections, pages, products, queries} = items;

            if (state === 'loading' && term.current) {
              return <div>Loading...</div>;
            }

            if (!total) {
              return <SearchResultsPredictive.Empty term={term} />;
            }

            return (
              <>
                <SearchResultsPredictive.Queries
                  queries={queries}
                  queriesDatalistId={queriesDatalistId}
                />
                <SearchResultsPredictive.Products
                  products={products}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Collections
                  collections={collections}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Pages
                  pages={pages}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Articles
                  articles={articles}
                  closeSearch={closeSearch}
                  term={term}
                />
                {term.current && total ? (
                  <Link
                    onClick={closeSearch}
                    to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                  >
                    <p>
                      View all results for <q>{term.current}</q>
                      &nbsp; →
                    </p>
                  </Link>
                ) : null}
              </>
            );
          }}
        </SearchResultsPredictive>
      </div>
    </Aside>
  );
}

/**
 * @param {{
 *   header: PageLayoutProps['header'];
 *   publicStoreDomain: PageLayoutProps['publicStoreDomain'];
 * }}
 */
function MobileMenuAside({header, publicStoreDomain}) {
  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside type="mobile" heading="MENU">
        <HeaderMenu
          menu={header.menu}
          viewport="mobile"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
      </Aside>
    )
  );
}

/**
 * @typedef {Object} PageLayoutProps
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {HeaderQuery} header
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 * @property {React.ReactNode} [children]
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
