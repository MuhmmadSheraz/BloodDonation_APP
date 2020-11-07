export const showAreas = async () => {
  const response = await fetch(
    "https://api.foursquare.com/v2/venues/search?client_id=1LZPR3RSBOVC431GJ22CYJCNE1K5EDRXFMVC3L4KM0UP04IR&client_secret=YCIX5AWPX1H2PDP1PP1G3TCTFVVPT2Z5P4XSTLPZTBNKLV4X&&limit=50&v=20180323&ll=24.860735,67.001137"
  );
  const data = await response.json();
  return await data.response.venues;
};
