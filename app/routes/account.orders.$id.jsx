import { json, redirect } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';
import { Money, Image, flattenConnection } from '@shopify/hydrogen';
import { CUSTOMER_ORDER_QUERY } from '~/graphql/customer-account/CustomerOrderQuery';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({ data }) => {
  return [{ title: `Order ${data?.order?.name}` }];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({ params, context }) {
  if (!params.id) {
    return redirect('/account/orders');
  }

  const orderId = atob(params.id);
  const { data, errors } = await context.customerAccount.query(
    CUSTOMER_ORDER_QUERY,
    {
      variables: { orderId },
    },
  );

  if (errors?.length || !data?.order) {
    throw new Error('Order not found');
  }

  const { order } = data;

  const lineItems = flattenConnection(order.lineItems);
  const discountApplications = flattenConnection(order.discountApplications);

  const fulfillmentStatus =
    flattenConnection(order.fulfillments)[0]?.status ?? 'N/A';

  const firstDiscount = discountApplications[0]?.value;

  const discountValue =
    firstDiscount?.__typename === 'MoneyV2' && firstDiscount;

  const discountPercentage =
    firstDiscount?.__typename === 'PricingPercentageValue' &&
    firstDiscount?.percentage;

  return json({
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  });
}

export default function OrderRoute() {
  /** @type {LoaderReturnData} */
  const {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  } = useLoaderData();
  return (
    <div className="account-order">
      <h2>Order {order.name}</h2>
      <p>Placed on {new Date(order.processedAt).toDateString()}</p>
      <br />
      <div>
        <div className="order-summary">
          {/* Header */}
          <div className="order-header">
            <div>Product</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Total</div>
          </div>

          {/* Line Items */}
          <div className="order-body">
            {lineItems.map((lineItem, lineItemIndex) => (
              <OrderLineRow key={lineItemIndex} lineItem={lineItem} />
            ))}
          </div>

          {/* Discounts */}
          {((discountValue && discountValue.amount) || discountPercentage) && (
            <div className="order-discounts">
              <div>
                <p>Discounts</p>
              </div>
              <div>
                <p>Discounts</p>
              </div>
              <div>
                {discountPercentage ? (
                  <span>-{discountPercentage}% OFF</span>
                ) : (
                  discountValue && <Money data={discountValue} />
                )}
              </div>
            </div>
          )}

          {/* Subtotal */}
          {/* <div className='subtotal-container'>
            <div className="order-subtotal">
              <div>
                <p>Subtotal</p>
              </div>
              <div>
                <p>Subtotal</p>
              </div>
              <div>
                <Money data={order.subtotal} />
              </div>
            </div>

            <div className="order-tax">
              <div>Tax</div>
              <div>
                <p>Tax</p>
              </div>
              <div>
                <Money data={order.totalTax} />
              </div>
            </div>

            <div className="order-total">
              <div>Total</div>
              <div>
                <p>Total</p>
              </div>
              <div>
                <Money data={order.totalPrice} />
              </div>
            </div>
          </div> */}
        </div>
        <div className='shipping-container'>
          <h3>Shipping Address</h3>
          {order?.shippingAddress ? (
            <address>
              <p>{order.shippingAddress.name}</p>
              {order.shippingAddress.formatted ? (
                <p>
                  {order.shippingAddress.formatted.join(', ')}
                </p>
              ) : (
                ' '
              )}
              {order.shippingAddress.formattedArea ? (
                <p>{order.shippingAddress.formattedArea}</p>
              ) : (
                ' '
              )}
            </address>
          ) : (
            <p>No shipping address defined</p>
          )}
          <h3>Status</h3>
          <div>
            <p>{fulfillmentStatus}</p>
          </div>
        </div>
      </div>
      <br />
      <p>
        <a target="_blank" href={order.statusPageUrl} rel="noreferrer">
          View Order Status →
        </a>
      </p>
    </div>
  );
}

/**
 * @param {{lineItem: OrderLineItemFullFragment}}
 */
function OrderLineRow({ lineItem }) {
  return (
    <div key={lineItem.id} className="line-item">
      {/* Product Details */}
      <div className="line-item-product">
        {lineItem?.image && (
          <div className="line-item-image">
            <Image data={lineItem.image} width={96} height={96} />
          </div>
        )}
        <div className="line-item-details">
          <p className="line-item-title">{lineItem.title}</p>
          <small className="line-item-variant">{lineItem.variantTitle}</small>
        </div>
      </div>

      {/* Price */}
      <div className="line-item-price">
        <Money data={lineItem.price} />
      </div>

      {/* Quantity */}
      <div className="line-item-quantity">
        {lineItem.quantity}
      </div>

      {/* Total Discount */}
      <div className="line-item-discount">
        <Money data={lineItem.totalDiscount} />
      </div>
    </div>
  );
}

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('customer-accountapi.generated').OrderLineItemFullFragment} OrderLineItemFullFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
