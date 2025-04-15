import * as cheerio from "cheerio";

async function fetchWordDetails(word: string) {
  const response = await fetch(
    `https://dic.daum.net/search.do?q=${word}&dic=eng&search_first=Y`
  );
  const html = await response.text();

  const $ = cheerio.load(html);

  const definitions = $(".list_search")
    .first()
    .find(".txt_search")
    .map((_, el) => $(el).text())
    .get();

  const listenElement = $(".wrap_listen").first();
  const pronounceElement = listenElement.find(".txt_pronounce");
  const americanSymbol = pronounceElement.first().text();
  const britishSymbol = pronounceElement.last().text();
  const anchorElement = listenElement.find("a[data-audio]");
  const americanHref = anchorElement.first().attr("href") ?? "";
  const britishHref = anchorElement.last().attr("href") ?? "";
  const pronunciations = [
    {
      accent: "american",
      symbol: americanSymbol,
      href: americanHref.replace("http://", "https://"),
    },
    {
      accent: "british",
      symbol: britishSymbol,
      href: britishHref.replace("http://", "https://"),
    },
  ];
  const examples = $(".list_example")
    .first()
    .find(".box_example")
    .map((_, el) => ({
      text: $(el).find(".txt_example .txt_ex").text(),
      meaning: $(el).find(".mean_example .txt_ex").text(),
    }))
    .get();

  return { definitions, pronunciations, examples };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      const word = message.data;
      const { definitions, pronunciations, examples } = await fetchWordDetails(
        word
      );

      sendResponse({ word, definitions, pronunciations, examples });
    } catch (error) {
      sendResponse({ error: "Failed to fetch dictionary data" });
    }
  })();

  return true;
});
