import { NowRequest, NowResponse } from "@now/node";
import { buildTemplate, ILinkdashRow } from "linkdash";
import FRUITS_STORE from "./_utils/data";

export default (req: NowRequest, res: NowResponse) => {
  const {
    query: { key },
  } = req;

  if (key !== "MY_SECRET_KEY") {
    return res.status(401).json({
      status: "error",
      message: "You are not authorised to access this page.",
      statusCode: 401,
    });
  }

  const dashboardHTML = buildTemplate({
    title: "My fruit store",
    htmlHead: "<meta name='favourite_fruit' content='apple' />",
    urls: [
      FRUITS_STORE.reduce<any>((acc, fruit) => {
        const formattedFruit: ILinkdashRow = {
          id: `fruit-${fruit.id}`,
          title: `Search google about ${fruit.name}`,
          group: "Fruits",
          href: `https://www.google.com/search?q=${fruit.name}%20fruit`,
        };
        acc.push(formattedFruit);
        return acc;
      }, []),
    ],
  });

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(dashboardHTML);
};
