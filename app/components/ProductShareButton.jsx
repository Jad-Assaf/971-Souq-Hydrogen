import React, { useState, useRef } from 'react';
import { useLocation } from '@remix-run/react';

export function ProductShareButton({ product }) {
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const inputRef = useRef(null);
    const location = useLocation();

    // Construct full product URL
    const productUrl = `https://macarabia.me${location.pathname}`;

    const handleCopyClick = () => {
        if (inputRef.current) {
            inputRef.current.select();
            navigator.clipboard.writeText(productUrl).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 3000);
            });
        }
    };

    return (
        <div className="share-content">
            <button
                className="share-button__button button"
                onClick={() => setIsShareOpen(!isShareOpen)}
            >
                <ShareIcon /> <span>Share</span>
            </button>

            {isShareOpen && (
                <div className="share-button__fallback">
                    <div className="share-header">
                        <h2 className="share-title"><span>Share</span></h2>
                        <button
                            type="button"
                            className="share-button__close"
                            aria-label="Close"
                            onClick={() => setIsShareOpen(false)}
                        >
                            <CloseIcon /><span>Close</span>
                        </button>
                    </div>

                    <div className="wrapper-content">
                        <label className="form-label">Copy to Clipboard</label>

                        <div className="share-group">
                            <div className="form-field">
                                <input
                                    type="text"
                                    className="field__input"
                                    id="share-url"
                                    value={productUrl}
                                    ref={inputRef}
                                    onClick={(e) => e.target.select()}
                                    readOnly
                                />
                                <label
                                    className="field__label hiddenLabels"
                                    htmlFor="share-url"
                                >
                                    Share URL
                                </label>
                            </div>

                            <button
                                className="button button--primary button-copy"
                                onClick={handleCopyClick}
                            >
                                <ClipboardIcon /> Copy to Clipboard
                            </button>
                        </div>

                        {isCopied && (
                            <span
                                id={`ShareMessage-${product.id}`}
                                className="share-button__message"
                                role="status"
                            >
                                Copied successfully!
                            </span>
                        )}

                        <div className="share_toolbox clearfix">
                            <label className="form-label">Share</label>
                            <div className="social-share-icons">
                                {/* WhatsApp Share */}
                                <a
                                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${product.title} - ${productUrl}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-share-icon whatsapp"
                                >
                                    <WhatsAppIcon />
                                </a>

                                {/* Facebook Share */}
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-share-icon facebook"
                                >
                                    <FacebookIcon />
                                </a>

                                {/* Twitter Share */}
                                <a
                                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${product.title}`)}&url=${encodeURIComponent(productUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-share-icon twitter"
                                >
                                    <TwitterIcon />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Icon components (you can replace these with actual SVG icons)
function ShareIcon() {
    return <svg class="icon" viewBox="0 0 227.216 227.216"><path d="M175.897,141.476c-13.249,0-25.11,6.044-32.98,15.518l-51.194-29.066c1.592-4.48,2.467-9.297,2.467-14.317c0-5.019-0.875-9.836-2.467-14.316l51.19-29.073c7.869,9.477,19.732,15.523,32.982,15.523c23.634,0,42.862-19.235,42.862-42.879C218.759,19.229,199.531,0,175.897,0C152.26,0,133.03,19.229,133.03,42.865c0,5.02,0.874,9.838,2.467,14.319L84.304,86.258c-7.869-9.472-19.729-15.514-32.975-15.514c-23.64,0-42.873,19.229-42.873,42.866c0,23.636,19.233,42.865,42.873,42.865c13.246,0,25.105-6.042,32.974-15.513l51.194,29.067c-1.593,4.481-2.468,9.3-2.468,14.321c0,23.636,19.23,42.865,42.867,42.865c23.634,0,42.862-19.23,42.862-42.865C218.759,160.71,199.531,141.476,175.897,141.476z M175.897,15c15.363,0,27.862,12.5,27.862,27.865c0,15.373-12.499,27.879-27.862,27.879c-15.366,0-27.867-12.506-27.867-27.879C148.03,27.5,160.531,15,175.897,15z M51.33,141.476c-15.369,0-27.873-12.501-27.873-27.865c0-15.366,12.504-27.866,27.873-27.866c15.363,0,27.861,12.5,27.861,27.866C79.191,128.975,66.692,141.476,51.33,141.476z M175.897,212.216c-15.366,0-27.867-12.501-27.867-27.865c0-15.37,12.501-27.875,27.867-27.875c15.363,0,27.862,12.505,27.862,27.875C203.759,199.715,191.26,212.216,175.897,212.216z"></path></svg>;
}

function CloseIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M 38.982422 6.9707031 A 2.0002 2.0002 0 0 0 37.585938 7.5859375 L 24 21.171875 L 10.414062 7.5859375 A 2.0002 2.0002 0 0 0 8.9785156 6.9804688 A 2.0002 2.0002 0 0 0 7.5859375 10.414062 L 21.171875 24 L 7.5859375 37.585938 A 2.0002 2.0002 0 1 0 10.414062 40.414062 L 24 26.828125 L 37.585938 40.414062 A 2.0002 2.0002 0 1 0 40.414062 37.585938 L 26.828125 24 L 40.414062 10.414062 A 2.0002 2.0002 0 0 0 38.982422 6.9707031 z"></path></svg>;
}

function ClipboardIcon() {
    return <svg class="icon icon-clipboard" width="11" height="13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 1a1 1 0 011-1h7a1 1 0 011 1v9a1 1 0 01-1 1V1H2zM1 2a1 1 0 00-1 1v9a1 1 0 001 1h7a1 1 0 001-1V3a1 1 0 00-1-1H1zm0 10V3h7v9H1z" fill="currentColor"></path></svg>;
}

function WhatsAppIcon() {
    return <svg class="icon icon-whatsapp" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 256 256" xmlSpace="preserve"><defs></defs><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"><path d="M 76.735 13.079 C 68.315 4.649 57.117 0.005 45.187 0 C 20.605 0 0.599 20.005 0.589 44.594 c -0.003 7.86 2.05 15.532 5.953 22.296 L 0.215 90 l 23.642 -6.202 c 6.514 3.553 13.848 5.426 21.312 5.428 h 0.018 c 0.001 0 -0.001 0 0 0 c 24.579 0 44.587 -20.007 44.597 -44.597 C 89.789 32.713 85.155 21.509 76.735 13.079 z M 27.076 46.217 c -0.557 -0.744 -4.55 -6.042 -4.55 -11.527 c 0 -5.485 2.879 -8.181 3.9 -9.296 c 1.021 -1.115 2.229 -1.394 2.972 -1.394 s 1.487 0.007 2.136 0.039 c 0.684 0.035 1.603 -0.26 2.507 1.913 c 0.929 2.231 3.157 7.717 3.436 8.274 c 0.279 0.558 0.464 1.208 0.093 1.952 c -0.371 0.743 -0.557 1.208 -1.114 1.859 c -0.557 0.651 -1.17 1.453 -1.672 1.952 c -0.558 0.556 -1.139 1.159 -0.489 2.274 c 0.65 1.116 2.886 4.765 6.199 7.72 c 4.256 3.797 7.847 4.973 8.961 5.531 c 1.114 0.558 1.764 0.465 2.414 -0.279 c 0.65 -0.744 2.786 -3.254 3.529 -4.369 c 0.743 -1.115 1.486 -0.929 2.507 -0.558 c 1.022 0.372 6.5 3.068 7.614 3.625 c 1.114 0.558 1.857 0.837 2.136 1.302 c 0.279 0.465 0.279 2.696 -0.65 5.299 c -0.929 2.603 -5.381 4.979 -7.522 5.298 c -1.92 0.287 -4.349 0.407 -7.019 -0.442 c -1.618 -0.513 -3.694 -1.199 -6.353 -2.347 C 34.934 58.216 27.634 46.961 27.076 46.217 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: evenodd; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"></path></g></svg>;
}

function FacebookIcon() {
    return <svg aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="icon icon-facebook"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path></svg>;
}

function TwitterIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" role="presentation" class="icon icon-mail"><path d="M 1 3 L 1 5 L 1 18 L 3 18 L 3 5 L 19 5 L 19 3 L 3 3 L 1 3 z M 5 7 L 5 7.1777344 L 14 12.875 L 23 7.125 L 23 7 L 5 7 z M 23 9.2832031 L 14 15 L 5 9.4160156 L 5 21 L 14 21 L 14 17 L 17 17 L 17 14 L 23 14 L 23 9.2832031 z M 19 16 L 19 19 L 16 19 L 16 21 L 19 21 L 19 24 L 21 24 L 21 21 L 24 21 L 24 19 L 21 19 L 21 16 L 19 16 z"></path></svg>;
}
