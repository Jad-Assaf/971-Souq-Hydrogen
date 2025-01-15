import {Link} from '@remix-run/react';
import React, {useRef, useState} from 'react';

// Reusable Component for CollectionItem
const CollectionItem = ({collection, index}) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <Link
      to={collection.url}
      className={`menu-item-container ${isLoading ? 'loading' : ''}`}
    >
      <div className="menu-item-image-wrapper">
        {collection.image && (
          <img
            src={`${collection.image.url}?width=300&quality=15`}
            srcSet={`${collection.image.url}?width=300&quality=15 300w,
                     ${collection.image.url}?width=600&quality=15 600w,
                     ${collection.image.url}?width=1200&quality=15 1200w`}
            alt={collection.image.altText || collection.title}
            className="menu-item-image"
            width={150}
            height={150}
            loading="lazy"
            onLoad={handleImageLoad}
          />
        )}
      </div>
      <div className="category-title">{collection.title}</div>
    </Link>
  );
};

// First Collection
export const appleMenu = [
  {
    id: 1,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/12fd96e86a8a35b81eeaeca3d9ce823a.jpg?v=1714657013',
      altText: 'Apple Accessories',
    },
    title: 'Apple Accessories',
    url: '/collections/apple-accessories',
  },
  {
    id: 2,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Apple-MacBook-Air.jpg?v=1714657225',
      altText: 'Apple Macbook Air',
    },
    title: 'Apple Macbook',
    url: '/collections/apple-macbook-air',
  },
  {
    id: 8,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Apple-MacBook-Pro.jpg?v=1714657223',
      altText: 'Apple Macbooks Pro',
    },
    title: 'Apple Macbook Pro',
    url: '/collections/apple-macbook-pro',
  },
  {
    id: 3,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/f7585a000668e51f562541efa35d1178.jpg?v=1714657015',
      altText: 'Apple iMac',
    },
    title: 'Apple iMac',
    url: '/collections/apple-imac',
  },
  {
    id: 4,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/e3a857086e38bb988a5569c2cba8a08c.jpg?v=1714656972',
      altText: 'Apple iPad',
    },
    title: 'Apple iPad',
    url: '/collections/apple-ipad',
  },
  {
    id: 5,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/f74fe97487470214273fc892ff0d9dac.jpg?v=1714657017',
      altText: 'Apple Mac Mini',
    },
    title: 'Apple Mac Mini',
    url: '/collections/apple-mac-mini',
  },
  {
    id: 6,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/MJMV3-4_e0d1f591-fc63-4300-b086-2076a8b708af.jpg?v=1714657136',
      altText: 'Apple Mac Studio',
    },
    title: 'Apple Mac Studio',
    url: '/collections/apple-mac-studio',
  },
  {
    id: 7,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/0b93f20be8c5baec875c87a48cd5f330.jpg?v=1714657020',
      altText: 'Apple Watch',
    },
    title: 'Apple Watch',
    url: '/collections/apple-watch',
  },
];

// Second Collection
export const gamingMenu = [
  {
    id: 1,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/2481e9abe158cadab142174d138852a2.jpg?v=1714657038',
      altText: 'Gaming Laptops',
    },
    title: 'Gaming Laptops',
    url: '/collections/gaming-laptops',
  },
  {
    id: 2,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/gaming-desktop-offer-2.jpg?v=1714657143',
      altText: 'Gaming Desktops',
    },
    title: 'Gaming Desktops',
    url: '/collections/gaming-desktops',
  },
  {
    id: 3,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Gaming-Monitors.jpg?v=1714657201',
      altText: 'Gaming Monitors',
    },
    title: 'Gaming Monitors',
    url: '/collections/gaming-monitors',
  },
  {
    id: 4,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/cbd4f23fcac98d9bf7769fa0e8983881.jpg',
      altText: 'Gaming Consoles',
    },
    title: 'Gaming Console',
    url: '/collections/gaming-consoles',
  },
  {
    id: 5,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Handhled-Gaming-Consoles-Collection.jpg?v=1714657197',
      altText: 'Handheld Consoles',
    },
    title: 'Handheld Consoles',
    url: '/collections/handheld-consoles',
  },
  {
    id: 6,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Console-Games-Collection.jpg?v=1714657198',
      altText: 'Console Games',
    },
    title: 'Console Games',
    url: '/collections/console-games',
  },
  {
    id: 7,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Virtual-Reality-Collection.jpg?v=1714657200',
      altText: 'Virutal Reality',
    },
    title: 'Virutal Reality',
    url: '/collections/virtual-reality',
  },
  {
    id: 8,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/razer-blackwidow-2019-left-side.webp?v=1714657154',
      altText: 'Gaming Accessories',
    },
    title: 'Gaming Accessories',
    url: '/collections/gaming-accessories',
  },
  {
    id: 9,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/dead-skull.webp?v=1714657488',
      altText: 'Playstation Accessories',
    },
    title: 'PS Accessories',
    url: '/collections/ps-accessories',
  },
];

export const laptopsMenu = [
  {
    id: 1,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/be78f4b09d08ca7c9af85a5bda2b2066.jpg?v=1714656985',
      altText: 'Acer Laptops',
    },
    title: 'Acer Laptops',
    url: '/collections/acer-laptops',
  },
  {
    id: 2,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/6573823c46feafed973c1af406eff3ac.jpg?v=1714656986',
      altText: 'Asus Laptops',
    },
    title: 'Asus Laptops',
    url: '/collections/asus',
  },
  {
    id: 3,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/402c7e42624f70fb506dc8e2ba6ff5d0.jpg?v=1714656983',
      altText: 'Dell Laptops',
    },
    title: 'Dell Laptops',
    url: '/collections/dell',
  },
  {
    id: 4,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/c70dff45e570d9e5d8f15ed6553009fb.png?v=1714656977',
      altText: 'HP Laptops',
    },
    title: 'HP Laptops',
    url: '/collections/hp',
  },
  {
    id: 5,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/04dec497761e64442d9c73ebe4c9fd16.png?v=1714656979',
      altText: 'Lenovo Laptops',
    },
    title: 'Lenovo Laptops',
    url: '/collections/lenovo',
  },
  {
    id: 6,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/fb752f20e83a395208643dfa13893f3c.jpg?v=1714657083',
      altText: 'Microsoft Surface Laptops',
    },
    title: 'Microsoft Surface Laptops',
    url: '/collections/microsoft-surface',
  },
  {
    id: 7,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/67c41fb2ae61930080965e2b309a24f2.jpg?v=1714657009',
      altText: 'MSI Laptops',
    },
    title: 'MSI Laptops',
    url: '/collections/msi',
  },
];

export const desktopsMenu = [
  {
    id: 1,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/hp-victus-desktop.jpg?v=1714656988',
      altText: 'Branded Desktops',
    },
    title: 'Branded Desktops',
    url: '/collections/branded-desktops',
  },
  {
    id: 2,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/gaming-desktop-offer-2.jpg?v=1714657143',
      altText: 'Gaming Desktops',
    },
    title: 'Gaming Desktops',
    url: '/collections/gaming-desktops',
  },
  {
    id: 3,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/29fa4b590132cda6ecb3c863dd618c20.jpg?v=1714656982',
      altText: 'All-in-one Desktops',
    },
    title: 'All-in-one Desktops',
    url: '/collections/all-in-one-desktops',
  },
  {
    id: 4,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/POS.jpg?v=1714657052',
      altText: 'POS',
    },
    title: 'POS',
    url: '/collections/pos',
  },
];

export const partsMenu = [
    {
        id: 1,
        image: {
            url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/mother-boards.jpg?v=1714657124',
            altText: 'Motherboards',
        },
        title: 'Branded Motherboards',
        url: '/collections/motherboards',
    },
    {
        id: 2,
        image: {
            url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/CPU_s.jpg?v=1714657125',
            altText: 'CPUs',
        },
        title: 'CPUs',
        url: '/collections/cpus',
    },
    {
        id: 3,
        image: {
            url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/CPU-Coolers.jpg?v=1714657122',
            altText: 'CPU Coolers',
        },
        title: 'CPU Coolers',
        url: '/collections/cpu-coolers',
    },
    {
        id: 4,
        image: {
            url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/GPU.jpg?v=1714657128',
            altText: 'GPUs',
        },
        title: 'GPUs',
        url: '/collections/GPU',
    },
    {
        id: 5,
        image: {
            url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/RAMS.jpg?v=1714657127',
            altText: 'RAM',
        },
        title: 'RAM',
        url: '/collections/ram',
    },
    {
        id: 6,
        image: {
            url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/ssd.jpg?v=1714657118',
      altText: 'Storage',
    },
    title: 'Storage',
    url: '/collections/storage',
},
{
    id: 7,
    image: {
        url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Power-Supply.jpg?v=1714657005',
        altText: 'Power Supplies',
    },
    title: 'Power Supplies',
    url: '/collections/power-supplies',
},
{
    id: 8,
    image: {
        url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/813d80b0b251c24004edfdc06bd71d99_7dc23fcb-2256-427d-a171-d45e906d9cc7.jpg?v=1714657092',
        altText: 'Desktop Cases',
    },
    title: 'Desktop Cases',
    url: '/collections/cases',
},
];

export const networkingMenu = [
  {
    id: 1,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Archer-VR2100.webp?v=1714657489',
      altText: 'WiFi Routers',
    },
    title: 'WiFi Routers',
    url: '/collections/wifi-routers',
  },
  {
    id: 2,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Mi-Wi-Fi-Range-Extender-Pro.webp?v=1714657494',
      altText: 'WiFi Range Extenders',
    },
    title: 'WiFi Range Extenders',
    url: '/collections/wifi-range-extenders',
  },
  {
    id: 3,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/img_proxy_d8c6be1f-6467-4b6a-b278-93dcc57e76ec.jpg?v=1714657495',
      altText: 'Antennas',
    },
    title: 'Antennas',
    url: '/collections/outdoor-poe-antennas',
  },
  {
    id: 4,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/USW-Pro-48-PoE.webp?v=1714657496',
      altText: 'Switches',
    },
    title: 'Switches',
    url: '/collections/switches',
  },
];

export const monitorsMenu = [
  {
    id: 1,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/68a0721e462f8235e2833e6740dbf357.jpg?v=1714657051',
      altText: 'AOC Monitors',
    },
    title: 'AOC Monitors',
    url: '/collections/aoc-monitors',
  },
  {
    id: 2,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/a376e912c280e174549ada1102c67c64.jpg?v=1714657113',
      altText: 'Acer Monitors',
    },
    title: 'Acer Monitors',
    url: '/collections/acer-monitors',
  },
  {
    id: 3,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/16e2c812a57d53ffd1bb610ef33372c0.jpg?v=1714657109',
      altText: 'Asus Monitors',
    },
    title: 'Asus Monitors',
    url: '/collections/asus-monitors',
  },
  {
    id: 4,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/1f9c9ccf9e0ec5b0376a28ae6f8c7de8.jpg?v=1714657024',
      altText: 'BenQ Monitors',
    },
    title: 'BenQ Monitors',
    url: '/collections/benq-monitors',
  },
  {
    id: 5,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/13c78bd433f2b1d805a0d103db6c7055.jpg?v=1714657110',
      altText: 'Dell Monitors',
    },
    title: 'Dell Monitors',
    url: '/collections/dell-monitors',
  },
  {
    id: 6,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/368f302b50e2de9aec3d17786a68bf4e.jpg?v=1714657115',
      altText: 'Gigabyte Monitors',
    },
    title: 'Gigabyte Monitors',
    url: '/collections/gigabyte-monitors',
  },
  {
    id: 7,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/2ecf13df52e054beba96c36bce764cde.jpg?v=1714657008',
      altText: 'HP Monitors',
    },
    title: 'HP Monitors',
    url: '/collections/hp-monitors',
  },
  {
    id: 8,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Lenovo-monitors.jpg?v=1714657029',
      altText: 'Lenovo Monitors',
    },
    title: 'Lenovo Monitors',
    url: '/collections/lenovo-monitors',
  },
  {
    id: 9,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/065951d902c864e1f35d3319e1a74fa4.jpg?v=1714657025',
      altText: 'LG Monitors',
    },
    title: 'LG Monitors',
    url: '/collections/lg-monitors',
  },
  {
    id: 10,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Msi-Monitors.jpg?v=1714657059',
      altText: 'MSI Monitors',
    },
    title: 'MSI Monitors',
    url: '/collections/msi-monitors',
  },
  {
    id: 11,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/philips-monitors.jpg?v=1714657006',
      altText: 'Philips Monitors',
    },
    title: 'Philips Monitors',
    url: '/collections/philips-monitor',
  },
  {
    id: 12,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/ef0a2b514fffc979ba73e8dabc6f5eac.jpg?v=1714657032',
      altText: 'Samsung Monitors',
    },
    title: 'Samsung Monitors',
    url: '/collections/samsung-monitors',
  },
  {
    id: 13,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/11.jpg?v=1714657134',
      altText: 'Viewsonic Monitors',
    },
    title: 'Viewsonic Monitors',
    url: '/collections/viewsonic-monitors',
  },
  {
    id: 14,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Samsung-TV_iTunes-Movies-and-TV-shows.jpg?v=1714657137',
      altText: 'Televisions',
    },
    title: 'Televisions',
    url: '/collections/televisions',
  },
];

export const mobilesMenu = [
  {
    id: 1,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Mobile-accessories.jpg?v=1714656995',
      altText: 'Mobile Accessories',
    },
    title: 'Mobile Accessories',
    url: '/collections/mobile-accessories',
  },
  {
    id: 2,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/b2991d32e4b537945124266af9681644.jpg?v=1714657030',
      altText: 'Apple iPhone',
    },
    title: 'Apple iPhone',
    url: '/collections/apple-iphone',
  },
  {
    id: 3,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/aa7c88badaf598a9b38e30dc825c85de.png?v=1714656974',
      altText: 'Samsung Mobile Phones',
    },
    title: 'Samsung Mobile Phones',
    url: '/collections/samsung-mobile-phones',
  },
  {
    id: 4,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/google.jpg?v=1714657087',
      altText: 'Google Pixel Phones',
    },
    title: 'Google Pixel Phones',
    url: '/collections/google-pixel-phones',
  },
  {
    id: 5,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/f219d124870eb12f1b7415b3c95b0017.jpg?v=1714657055',
      altText: 'Xiaomi Mobile Phones',
    },
    title: 'Xiaomi Mobile Phones',
    url: '/collections/xiaomi-mobile-phones',
  },
  {
    id: 6,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/infinix.jpg?v=1714657080',
      altText: 'Infinix Mobile Phones',
    },
    title: 'Infinix Mobile Phones',
    url: '/collections/infinix-mobile-phones',
  },
  {
    id: 7,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/dbae80cff5b0c94f558f5b0817c8ab4e.jpg?v=1714657065',
      altText: 'Asus Gaming Phones',
    },
    title: 'Asus Gaming Phones',
    url: '/collections/asus-rog-gaming-mobile-phones',
  },
];

export const tabletsMenu = [
  {
    id: 1,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Tablet-Accessories.jpg?v=1714657283',
      altText: 'Tablet Accessories',
    },
    title: 'Tablet Accessories',
    url: '/collections/tablet-accessories',
  },
  {
    id: 2,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/ede8ec2c515f709ee4f047128d664621.jpg?v=1714657066',
      altText: 'Graphic Design Tablets',
    },
    title: 'Graphic Tablets',
    url: '/collections/digital-text',
  },
  {
    id: 3,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Kindle.jpg?v=1714657088',
      altText: 'Kindle Tablets',
    },
    title: 'Kindle Tablets',
    url: '/collections/kindle-tablets',
  },
  {
    id: 4,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/060ef5a299d547641bd55b509d8ae11c.jpg?v=1714657089',
      altText: 'Amazon Tabelts',
    },
    title: 'Amazon Tabelts',
    url: '/collections/amazon-tablets',
  },
  {
    id: 5,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/59663e172d1f0fa78bcb873332d7e673.jpg?v=1714657091',
      altText: 'Samsung Tablets',
    },
    title: 'Samsung Tablets',
    url: '/collections/samsung-tablets',
  },
  {
    id: 6,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Lenovo-tablets.jpg?v=1714657012',
      altText: 'Lenovo Tablets',
    },
    title: 'Lenovo Tablets',
    url: '/collections/lenovo-tablets',
  },
  {
    id: 7,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/0b0868e76629ed14354e99d60ee4a0e1.jpg?v=1714657096',
      altText: 'Xiaomi Tablets',
    },
    title: 'Xiaomi Tablets',
    url: '/collections/xiaomi-tablets',
  },
];

export const audioMenu = [
  {
    id: 1,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Zoom-H8.webp?v=1714657894',
      altText: 'Audio Recorders',
    },
    title: 'Audio Recorders',
    url: '/collections/audio-recorders',
  },
  {
    id: 2,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/earbuds.jpg?v=1714657093',
      altText: 'Earbuds',
    },
    title: 'Earbuds',
    url: '/collections/earbuds',
  },
  {
    id: 3,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/headsets_3ca0e802-135e-4a41-87bd-9aeb574a257e.jpg',
      altText: 'Headphones',
    },
    title: 'Headphones',
    url: '/collections/headphones',
  },
  {
    id: 4,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/speakers_7779c255-7f3b-408c-9e44-726650bda835.jpg',
      altText: 'Speakers',
    },
    title: 'Speakers',
    url: '/collections/speakers',
  },
  {
    id: 5,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Surround-Systems.jpg?v=1714657298',
      altText: 'Surround Systems',
    },
    title: 'Surround Systems',
    url: '/collections/surround-systems',
  },
  {
    id: 6,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/1a1a.jpg?v=1714657064',
      altText: 'Microphones',
    },
    title: 'Microphones',
    url: '/collections/microphones',
  },
  {
    id: 7,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/audio-_-Visual.jpg?v=1714657133',
      altText: 'Pioneer Equipment',
    },
    title: 'Pioneer Equipment',
    url: '/collections/pioneer-equipment',
  },
];

export const accessoriesMenu = [
  {
    id: 1,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/9bd9787c9f7cf3d78706698066fe550b.jpg?v=1714656989',
      altText: 'Computer Accessories',
    },
    title: 'Computer Accessories',
    url: '/collections/computer-accessories',
  },
  {
    id: 2,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/car-accessories_1daafce0-e458-4c00-abd5-4a62fe64abf2.jpg',
      altText: 'Car Accessories',
    },
    title: 'Car Accessories',
    url: '/collections/car-accessories',
  },
  {
    id: 3,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Thule-Chasm-BackPack-Black-2.jpg?v=1714657018',
      altText: 'Backpacks and Bags',
    },
    title: 'Backpacks & Bags',
    url: '/collections/backpacks-bags',
  },
  {
    id: 4,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/SMART-HOME-DEVICES.jpg?v=1714657099',
      altText: 'Home Appliances',
    },
    title: 'Home Appliances',
    url: '/collections/home-appliances',
  },
  {
    id: 5,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/printers.jpg?v=1714656998',
      altText: 'Printers',
    },
    title: 'Printers',
    url: '/collections/printers',
  },
  {
    id: 6,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/scooters.jpg?v=1714657047',
      altText: 'Scooters',
    },
    title: 'Scooters',
    url: '/collections/scooters',
  },
  {
    id: 7,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Projectors.jpg?v=1714657100',
      altText: 'Projectors',
    },
    title: 'Projectors',
    url: '/collections/projectors',
  },
];

export const fitnessMenu = [
  {
    id: 1,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/huawei-band-8-grey-orange-2.jpg?v=1714657604',
      altText: 'Fitness Bands',
    },
    title: 'Fitness Bands',
    url: '/collections/fitness-bands',
  },
  {
    id: 2,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Samsung-Watches.jpg?v=1714657104',
      altText: 'Samsung Watches',
    },
    title: 'Samsung Watches',
    url: '/collections/samsung-watches',
  },
  {
    id: 3,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/img_proxy_1d5f1de1-9b79-49a6-9e74-a8c2869daf98.jpg?v=1714657022',
      altText: 'Garmin Watches',
    },
    title: 'Garmin Watches',
    url: '/collections/garmin-smart-watch',
  },
  {
    id: 4,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/CMF-by-Nothing-Watch-Pro-5.webp?v=1714657901',
      altText: 'Nothing Watches',
    },
    title: 'Nothing Watches',
    url: '/collections/nothing-watch',
  },
  {
    id: 5,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/730fbee436f3094d6f71dc35da69eff7.jpg?v=1714657068',
      altText: 'Amazfit Watches',
    },
    title: 'Amazfit Watches',
    url: '/collections/amazfit-watches',
  },
  {
    id: 6,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/5b1a5ef91f3421e41193daa1fb8675bc.jpg?v=1714657106',
      altText: 'Xiaomi Watches',
    },
    title: 'Xiaomi Watches',
    url: '/collections/xiaomi-watches',
  },
  {
    id: 7,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Huawei-watches.jpg?v=1714657107',
      altText: 'Huawei Watches',
    },
    title: 'Huawei Watches',
    url: '/collections/huawei-watches',
  },
  {
    id: 8,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/068958ad9c591e260a1fd7c8aa4055be.jpg',
      altText: 'Fitbit Watches',
    },
    title: 'Fitbit Watches',
    url: '/collections/fitbit-smartwatch',
  },
  {
    id: 9,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/pd-kdwst-BU.webp?v=1714657902',
      altText: 'Porodo Watches',
    },
    title: 'Porodo Watches',
    url: '/collections/porodo-watch',
  },
  {
    id: 10,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/green-lion-grand-smart-4.jpg?v=1714657205',
      altText: 'Green Lion Watches',
    },
    title: 'Green Lion Watches',
    url: '/collections/green-lion-watch',
  },
  {
    id: 11,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Porodo-Lifestyle-Smart-Voice-Jump-Skip-Rope.webp',
      altText: 'Fitness Equipment',
    },
    title: 'Fitness Equipment',
    url: '/collections/fitness-equipment',
  },
  {
    id: 12,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Porodo-Smart-Wearable-Ring.webp?v=1714657898',
      altText: 'Fitness Rings',
    },
    title: 'Fitness Rings',
    url: '/collections/fitness-rings',
  },
];

export const camerasMenu = [
  {
    id: 1,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Action-Cameras-Collection.jpg?v=1714657202',
      altText: 'Action Cameras',
    },
    title: 'Action Cameras',
    url: '/collections/action-cameras',
  },
  {
    id: 2,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/cameras-accessories.jpg?v=1714657204',
      altText: 'Action Camera Accessories',
    },
    title: 'Action Camera Accessories',
    url: '/collections/action-cameras-accessories',
  },
  {
    id: 3,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/3ce866744a2e083d79cf0545d7b5b5cc.jpg?v=1714657062',
      altText: 'Drones',
    },
    title: 'Drones',
    url: '/collections/drones',
  },
  {
    id: 4,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Insta360-Flow-Smartphone-Gimbal-Stabilizer-4.webp?v=1714657884',
      altText: 'Gimbal Stabilizer',
    },
    title: 'Gimbal Stabilizer',
    url: '/collections/gimbal-stabilizer',
  },
  {
    id: 5,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/771748c78dc8da6e89a773af5e1b1a4b.jpg?v=1714657077',
      altText: 'Professional Cameras',
    },
    title: 'Professional Cameras',
    url: '/collections/cameras',
  },
  {
    id: 6,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/canon-camera-lens.jpg?v=1714657157',
      altText: 'Camera Lenses',
    },
    title: 'Camera Lenses',
    url: '/collections/camera-lenses',
  },
  {
    id: 7,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Neewer-A111-Bi-Color-Rig-Light-Stabilizer.webp?v=1714657891',
      altText: 'Camera Accessories',
    },
    title: 'Camera Accessories',
    url: '/collections/camera-accessories',
  },
  {
    id: 8,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Camcorders.jpg?v=1714657342',
      altText: 'Camcorders',
    },
    title: 'Camcorders',
    url: '/collections/camcorders',
  },
  {
    id: 9,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/razer-webcam.jpg?v=1714657158',
      altText: 'Webcams',
    },
    title: 'Webcams',
    url: '/collections/webcams',
  },
  {
    id: 10,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/64b7bbdad8239f5eb7e1f2fd9db0f323.jpg?v=1714657078',
      altText: 'Surveillance Cameras',
    },
    title: 'Surveillance Cameras',
    url: '/collections/surveillance-cameras',
  },
];

export const homeAppliancesMenu = [
  {
    id: 1,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/kitchen-Appliances.jpg?v=1714657182',
      altText: 'Kitchen Appliances',
    },
    title: 'Kitchen Appliances',
    url: '/collections/kitchen-appliances',
  },
  {
    id: 2,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/cleaning_devices.jpg?v=1714657183',
      altText: 'Cleaning Devices',
    },
    title: 'Cleaning Devices',
    url: '/collections/cleaning-devices',
  },
  {
    id: 3,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/Lighting.jpg?v=1714657186',
      altText: 'Lighting',
    },
    title: 'Lighting',
    url: '/collections/lighting',
  },
  {
    id: 4,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/streaming-devices.jpg?v=1714657190',
      altText: 'Streaming Devices',
    },
    title: 'Streaming Devices',
    url: '/collections/streaming-devices',
  },
  {
    id: 5,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/IOT.jpg?v=1714657192',
      altText: 'Smart Home',
    },
    title: 'Smart Home',
    url: '/collections/iot',
  },
  {
    id: 6,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0858/6821/6639/collections/health_Beauty.jpg?v=1714657193',
      altText: 'Personal Care',
    },
    title: 'Personal Care',
    url: '/collections/personal-care',
  },
];

export const CollectionCircles = ({collections}) => {
  const sliderRef = useRef(null); // Reference for the slider container

  const scrollSlider = (distance) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({left: distance, behavior: 'smooth'});
    }
  };

  return (
    <div className="menu-slider-container" style={{position: 'relative'}}>
      {/* Previous Button */}
      <button
        className="circle-prev-button"
        onClick={() => scrollSlider(-600)}
        style={{
          position: 'absolute',
          top: '50%',
          left: '0',
          transform: 'translateY(-50%)',
        }}
      >
        <CustomLeftArrow />
      </button>

      <div
        className="animated-menu-item"
        ref={sliderRef}
        style={{overflowX: 'auto', display: 'flex'}}
      >
        {collections.map((collection, collectionIndex) => (
          <CollectionItem
            collection={collection}
            index={collectionIndex}
            key={collection.id}
          />
        ))}
      </div>

      {/* Next Button */}
      <button
        className="circle-next-button"
        onClick={() => scrollSlider(600)}
        style={{
          position: 'absolute',
          top: '50%',
          right: '0',
          transform: 'translateY(-50%)',
        }}
      >
        <CustomRightArrow />
      </button>
    </div>
  );
};

// Arrow Icons
const CustomLeftArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const CustomRightArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);
