import React from "react";

export function ProductMetafields({ metafieldCondition, metafieldWarranty, metafieldShipping, metafieldVat }) {
    return (
        <div className="product-metafields">
            <ul>
                {metafieldCondition?.value && (
                    <li>
                         {metafieldCondition.value}
                    </li>
                )}
                {metafieldWarranty?.value && (
                    <li>
                        Warranty: {metafieldWarranty.value}
                    </li>
                )}
                {metafieldShipping?.value && (
                    <li>
                        Shipping: {metafieldShipping.value}
                    </li>
                )}
                {metafieldVat?.value && (
                    <li>
                        VAT: {metafieldVat.value}
                    </li>
                )}
            </ul>
        </div>
    );
}
