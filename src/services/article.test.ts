import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { JSDOM } from "jsdom";
import { canonicalizeWord, collectArticleWords, extractArticleFromHtml, importArticle, parseConlluCanonical, selectContextualTranslation, sentenceAt, wordParts } from "./article";
import { seedPair } from "../i18n/seedData";
import { articleWordStats, deleteSavedArticle, saveArticle, MAX_SAVED_ARTICLES, MAX_SAVED_ARTICLE_CHARS } from "./article";

describe("article word counters", () => {
  it("counts word occurrences and distinct memorized entries without substring matches", () => {
    const base = seedPair("en", "de").words[0];
    const words = [
      { ...base, id: "one", targetWord: "HALLO", status: "MASTERED" as const, examples: [] },
      { ...base, id: "duplicate", targetWord: "hallo", status: "MASTERED" as const, examples: [] },
      { ...base, id: "learning", targetWord: "Welt", status: "LEARNING" as const, examples: [] },
      { ...base, id: "substring", targetWord: "all", status: "MASTERED" as const, examples: [] },
    ];
    expect(articleWordStats("Hallo Welt! Hallo, 123.", words, "de")).toEqual({ total: 3, learned: 1 });
    expect(articleWordStats("123...", words, "de")).toEqual({ total: 0, learned: 0 });
    expect(articleWordStats("", words, "de")).toEqual({ total: 0, learned: 0 });
  });
  it("links dictionary forms and nonadjacent verb groups through saved article context", () => {
    const base = seedPair("en", "de").words[0];
    const words = [
      { ...base, targetWord: "aufmachen", status: "MASTERED" as const, examples: [{ targetSentence: "Sie machten die Türen auf.", translatedSentence: "They opened the doors." }] },
      { ...base, targetWord: "die Tür", status: "MASTERED" as const, examples: [{ targetSentence: "Sie machten die Türen auf.", translatedSentence: "They opened the doors." }] },
      { ...base, targetWord: "der Bahnhof", status: "MASTERED" as const, examples: [{ targetSentence: "Der Bahnhof ist neu.", translatedSentence: "The station is new." }] },
    ];
    expect(articleWordStats("Sie machten die Türen auf.", words, "de")).toEqual({ total: 5, learned: 2 });
  });
  it.each([
    ["en", "Hello, world!", 2], ["ru", "Привет, мир!", 2], ["de", "Hallo Welt!", 2],
    ["fr", "L’école est ouverte.", 3], ["it", "L’acqua è fresca.", 3], ["es", "El árbol crece.", 3],
  ] as const)("tokenizes %s consistently with the reader", (language, text, total) => {
    expect(articleWordStats(text, [], language)).toEqual({ total, learned: 0 });
  });
});

describe("saved article library", () => {
  const article = { title: " News ", text: " Hallo Welt. ", url: "https://example.com/story#top", language: "de" };
  it("saves, updates duplicates and deletes without mutating the pair", () => {
    const pair = seedPair("en", "de");
    const original = structuredClone(pair);
    const first = saveArticle(pair, article);
    expect(pair).toEqual(original);
    expect(first.saved).toMatchObject({ title: "News", text: "Hallo Welt.", language: "de", url: "https://example.com/story" });
    const second = saveArticle(first.pair, { ...article, text: "Updated", url: "https://example.com/story#other" });
    expect(second.saved.id).toBe(first.saved.id);
    expect(second.pair.savedArticles).toHaveLength(1);
    expect(first.pair.savedArticles![0].text).toBe("Hallo Welt.");
    const byText = saveArticle(first.pair, { ...article, url: "" });
    expect(byText.saved.id).toBe(first.saved.id);
    expect(deleteSavedArticle(first.pair, first.saved.id).savedArticles).toEqual([]);
    expect(first.pair.savedArticles).toHaveLength(1);
    expect(collectArticleWords(first.pair, [{ word: "Welt", translation: "world", sentence: "Hallo Welt." }], "Folder", "de").pair.savedArticles).toEqual(first.pair.savedArticles);
  });
  it("caps text and library size, retaining newest articles", () => {
    let pair = seedPair("en", "de");
    for (let i = 0; i < MAX_SAVED_ARTICLES + 2; i++) pair = saveArticle(pair, { title: `News ${i}`, text: "Body", url: "" }).pair;
    expect(pair.savedArticles).toHaveLength(MAX_SAVED_ARTICLES);
    expect(pair.savedArticles![0].title).toBe("News 51");
    const long = { ...article, text: "a".repeat(MAX_SAVED_ARTICLE_CHARS + 10) };
    const saved = saveArticle(pair, long);
    expect(saved.saved.text).toHaveLength(MAX_SAVED_ARTICLE_CHARS);
    expect(saveArticle(saved.pair, long).saved.id).toBe(saved.saved.id);
    expect(() => saveArticle(pair, { ...article, text: " " })).toThrow();
    expect(() => saveArticle(pair, { ...article, title: " " })).toThrow();
  });
});

afterEach(() => vi.unstubAllGlobals());
describe("article text and collection", () => {
  it.each([
    ["Tür", "Tür", "Sing", "die Tür"], ["Bahnhof", "Bahnhof", "Sing", "der Bahnhof"],
    ["Hauses", "Haus", "Sing", "das Haus"], ["Straße", "Strasse", "Sing", "die Straße"],
    ["Smartphones", "unknown", "Plur", "das Smartphone"], ["Bücher", "Bücher", "Plur", "das Buch"],
    ["Wälder", "Wälder", "Plur", "der Wald"], ["Äpfel", "Äpfel", "Plur", "der Apfel"],
    ["Vögel", "Vögel", "Plur", "der Vogel"], ["Mäntel", "Mäntel", "Plur", "der Mantel"],
    ["Gärten", "Gärten", "Plur", "der Garten"], ["Mütter", "Mütter", "Plur", "die Mutter"],
    ["Väter", "Väter", "Plur", "der Vater"], ["Brüder", "Brüder", "Plur", "der Bruder"],
    ["Schlösser", "Schlösser", "Plur", "das Schloss"], ["Gläser", "Gläser", "Plur", "das Glas"],
    ["Gräber", "Gräber", "Plur", "das Grab"], ["Nächte", "Nächte", "Plur", "die Nacht"],
    ["Söhne", "Söhne", "Plur", "der Sohn"], ["Füße", "Füsse", "Plur", "der Fuß"],
    ["Reichtümer", "Reichtümer", "Plur", "der Reichtum"], ["Herzen", "Herzen", "Plur", "das Herz"],
    ["Haustür", "Haustür", "Sing", "die Haustür"], ["Informationssystem", "Informationssystem", "Sing", "das Informationssystem"],
    ["Quarzblupp", "Quarzblupp", "Sing", "der Quarzblupp"],
  ])("normalizes German singular/plural nouns with missing gender: %s", (form, lemma, number, expected) => {
    const row = `1\t${form}\t${lemma}\tNOUN\t_\tNumber=${number}\t0\troot\t_\tTokenRange=0:${form.length}`;
    expect(parseConlluCanonical(row, form, "de", 0)).toBe(expected);
  });
  it.each([["See", "Masc", "der See"], ["See", "Fem", "die See"], ["Band", "Masc", "der Band"], ["Band", "Neut", "das Band"], ["Band", "Fem", "die Band"]])("respects contextual grammatical gender for %s", (word, gender, expected) => {
    expect(parseConlluCanonical(`1\t${word}\t${word}\tNOUN\t_\tGender=${gender}|Number=Sing\t0\troot\t_\tTokenRange=0:${word.length}`, word, "de", 0)).toBe(expected);
  });
  it.each([["zur", "Fem", "die Quarzblupp"], ["ins", "Neut", "das Quarzblupp"], ["dem", "Masc,Neut", "der Quarzblupp"]])("uses attached determiner/preposition clues: %s", (form, gender, expected) => {
    const conllu = [`1\t${form}\t${form}\tADP\t_\tGender=${gender}\t2\tcase\t_\t_`, "2\tQuarzblupp\tQuarzblupp\tNOUN\t_\tNumber=Sing\t0\troot\t_\t_"].join("\n");
    expect(parseConlluCanonical(conllu, "Quarzblupp", "de")).toBe(expected);
  });
  it("preserves Cyrillic, combining marks, umlauts, accents, hyphens and apostrophes", () => {
    const text = "Привет, Straße! élève niño l’amour mother-in-law.";
    const parts = wordParts(text);
    expect(parts.join("")).toBe(text);
    expect(parts.filter((_, i) => i % 2)).toEqual(["Привет", "Straße", "élève", "niño", "l’amour", "mother-in-law"]);
  });
  it("finds the clicked sentence by its real offset, including repeated words", () => {
    const text = "Hallo, Welt!\n\nEine neue Welt. Ende?";
    expect(sentenceAt(text, text.lastIndexOf("Welt"))).toBe("Eine neue Welt.");
    expect(sentenceAt(text, text.indexOf("Ende"))).toBe("Ende?");
  });
  it("merges duplicates without changing progress or mutating the original pair", () => {
    const pair = seedPair("en", "de");
    pair.words[0] = { ...pair.words[0], status: "REVIEW", step: 4, repCount: 21, lastReviewedOrder: 98 };
    const before = structuredClone(pair);
    const { pair: next, folderId } = collectArticleWords(pair, [
      { word: pair.words[0].targetWord.toUpperCase(), translation: "replacement", sentence: "context" },
      { word: "Äpfel", translation: "apples", sentence: "Ich esse Äpfel." },
      { word: "äpfel", translation: "apples", sentence: "Äpfel sind gut." },
    ], "Article", "de");
    expect(pair).toEqual(before);
    expect(next.words).toHaveLength(pair.words.length + 1);
    expect(next.words[0]).toEqual({ ...before.words[0], categoryIds: [...before.words[0].categoryIds, folderId] });
    expect(next.words.at(-1)).toMatchObject({ targetWord: "Äpfel", status: "NEW", step: 0, repCount: 0, categoryIds: [folderId], examples: [{ targetSentence: "Ich esse Äpfel.", translatedSentence: "" }] });
    expect(Object.values(next.categories.at(-1)!.name)).toEqual(Array(6).fill("Article"));
    expect(() => collectArticleWords(pair, Array(51).fill({ word: "a", translation: "b", sentence: "" }), "Article", "de")).toThrow();
  });
  it("rejects failed and malformed imports and passes cancellation to fetch", async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: false });
    vi.stubGlobal("fetch", fetch);
    await expect(importArticle("https://example.com")).rejects.toThrow();
    fetch.mockResolvedValue({ ok: true, json: async () => ({ text: "" }) });
    await expect(importArticle("https://example.com")).rejects.toThrow();
    const controller = new AbortController();
    fetch.mockImplementation(async (_url, options) => { expect(options.signal.aborted).toBe(true); throw new Error("aborted"); });
    controller.abort();
    await expect(importArticle("https://example.com", controller.signal)).rejects.toThrow("aborted");
  });
  it("converts conjugated verbs to infinitives, plural nouns to singular with articles, and adjectives to base forms across all 6 languages", async () => {
    const deConllu = [
      "1\tDie\tder\tDET\tART\tCase=Nom|Definite=Def|Number=Plur\t2\tdet\t_\tTokenRange=0:3",
      "2\tBücher\tBuch\tNOUN\tNN\tGender=Neut|Number=Plur\t3\tnsubj\t_\tTokenRange=4:10",
      "3\tlagen\tliegen\tVERB\tVVFIN\tMood=Ind|Number=Plur|Tense=Past\t0\troot\t_\tTokenRange=11:16",
      "4\tauf\tauf\tADP\tAPPR\t_\t6\tcase\t_\tTokenRange=17:20",
      "5\tden\tder\tDET\tART\tCase=Dat|Definite=Def|Number=Plur\t6\tdet\t_\tTokenRange=21:24",
      "6\tTischen\tTisch\tNOUN\tNN\tGender=Masc|Number=Plur\t3\tobl\t_\tTokenRange=25:32",
      "7\tund\tund\tCCONJ\tKON\t_\t9\tcc\t_\tTokenRange=33:36",
      "8\tdie\tder\tDET\tART\tCase=Nom|Definite=Def|Number=Plur\t9\tdet\t_\tTokenRange=37:40",
      "9\tKatzen\tKatze\tNOUN\tNN\tGender=Fem|Number=Plur\t10\tnsubj\t_\tTokenRange=41:47",
      "10\tmachten\tmachen\tVERB\tVVFIN\tMood=Ind|Number=Plur|Tense=Past\t3\tconj\t_\tTokenRange=48:55",
      "11\tdie\tder\tDET\tART\tCase=Acc|Definite=Def|Gender=Fem|Number=Sing\t12\tdet\t_\tTokenRange=56:59",
      "12\tTür\tTür\tNOUN\tNN\tGender=Fem|Number=Sing\t10\tobj\t_\tTokenRange=60:63",
      "13\tauf\tauf\tADP\tPTKVZ\tPartType=Vbp\t10\tcompound:prt\t_\tSpaceAfter=No|TokenRange=64:67",
      "14\tgrößeren\tgroß\tADJ\tADJA\tCase=Dat|Degree=Cmp|Number=Plur\t6\tamod\t_\tTokenRange=68:76",
    ].join("\n");
    expect(parseConlluCanonical(deConllu, "Bücher", "de", 4)).toBe("das Buch");
    expect(parseConlluCanonical(deConllu, "Tischen", "de", 25)).toBe("der Tisch");
    expect(parseConlluCanonical(deConllu, "Katzen", "de", 41)).toBe("die Katze");
    expect(parseConlluCanonical(deConllu, "lagen", "de", 11)).toBe("liegen");
    expect(parseConlluCanonical(deConllu, "machten", "de", 48)).toBe("aufmachen");
    expect(parseConlluCanonical(deConllu, "auf", "de", 64)).toBe("aufmachen");
    expect(parseConlluCanonical(deConllu, "größeren", "de", 68)).toBe("groß");

    const frConllu = [
      "1\tLes\tle\tDET\tRD\tDefinite=Def|Number=Plur\t2\tdet\t_\tTokenRange=0:3",
      "2\tchevaux\tcheval\tNOUN\tS\tGender=Masc|Number=Plur\t6\tnsubj\t_\tTokenRange=4:11",
      "3\t,\t,\tPUNCT\tFF\t_\t5\tpunct\t_\tTokenRange=11:12",
      "4\tles\tle\tDET\tRD\tDefinite=Def|Number=Plur\t5\tdet\t_\tTokenRange=13:16",
      "5\tmaisons\tmaison\tNOUN\tS\tGender=Fem|Number=Plur\t2\tconj\t_\tTokenRange=17:24",
      "6\tprenaient\tprendre\tVERB\tV\tMood=Ind|Number=Plur|Tense=Imp\t0\troot\t_\tTokenRange=25:34",
      "7\td'\tde\tADP\tE\t_\t8\tcase\t_\tTokenRange=35:37",
      "8\tarbres\tarbre\tNOUN\tS\tGender=Masc|Number=Plur\t6\tobl\t_\tTokenRange=37:43",
      "9\tbeaux\tbeau\tADJ\tA\tGender=Masc|Number=Plur\t2\tamod\t_\tTokenRange=44:49",
    ].join("\n");
    expect(parseConlluCanonical(frConllu, "chevaux", "fr", 4)).toBe("le cheval");
    expect(parseConlluCanonical(frConllu, "maisons", "fr", 17)).toBe("la maison");
    expect(parseConlluCanonical(frConllu, "prenaient", "fr", 25)).toBe("prendre");
    expect(parseConlluCanonical(frConllu, "d'arbres", "fr", 35)).toBe("l'arbre");
    expect(parseConlluCanonical(frConllu, "beaux", "fr", 44)).toBe("beau");

    const esConllu = [
      "1\tLas\tel\tDET\tda0fp0\tGender=Fem|Number=Plur\t2\tdet\t_\tTokenRange=0:3",
      "2\tciudades\tciudad\tNOUN\tncfp000\tGender=Fem|Number=Plur\t5\tnsubj\t_\tTokenRange=4:12",
      "3\t,\t,\tPUNCT\tfc\t_\t4\tpunct\t_\tTokenRange=12:13",
      "4\tproblemas\tproblema\tNOUN\tncmp000\tGender=Masc|Number=Plur\t2\tconj\t_\tTokenRange=14:23",
      "5\tpudieron\tpoder\tAUX\tvmis3p0\tMood=Ind|Number=Plur|Tense=Past\t0\troot\t_\tTokenRange=24:32",
      "6\taguas\tagua\tNOUN\tncfp000\tGender=Fem|Number=Plur\t5\tobj\t_\tTokenRange=33:38",
      "7\tfrías\tfrío\tADJ\taq0fp0\tGender=Fem|Number=Plur\t6\tamod\t_\tTokenRange=39:44",
    ].join("\n");
    expect(parseConlluCanonical(esConllu, "ciudades", "es", 4)).toBe("la ciudad");
    expect(parseConlluCanonical(esConllu, "problemas", "es", 14)).toBe("el problema");
    expect(parseConlluCanonical(esConllu, "pudieron", "es", 24)).toBe("poder");
    expect(parseConlluCanonical(esConllu, "aguas", "es", 33)).toBe("el agua");
    expect(parseConlluCanonical(esConllu, "frías", "es", 39)).toBe("frío");

    const itConllu = [
      "1\tI\til\tDET\tRD\tGender=Masc|Number=Plur\t2\tdet\t_\tTokenRange=0:1",
      "2\tlibri\tlibro\tNOUN\tS\tGender=Masc|Number=Plur\t8\tnsubj\t_\tTokenRange=2:7",
      "3\t,\t,\tPUNCT\tFF\t_\t4\tpunct\t_\tTokenRange=7:8",
      "4\tspecchi\tspecchio\tNOUN\tS\tGender=Masc|Number=Plur\t2\tconj\t_\tTokenRange=9:16",
      "5\t,\t,\tPUNCT\tFF\t_\t6\tpunct\t_\tTokenRange=16:17",
      "6\tcase\tcasa\tNOUN\tS\tGender=Fem|Number=Plur\t2\tconj\t_\tTokenRange=18:22",
      "7\t,\t,\tPUNCT\tFF\t_\t8\tpunct\t_\tTokenRange=22:23",
      "8\tisole\tisola\tNOUN\tS\tGender=Fem|Number=Plur\t9\tnsubj\t_\tTokenRange=24:29",
      "9\tcadevano\tcadere\tVERB\tV\tMood=Ind|Number=Plur|Tense=Imp\t0\troot\t_\tTokenRange=30:38",
      "10\tbelle\tbello\tADJ\tA\tGender=Fem|Number=Plur\t6\tamod\t_\tTokenRange=39:44",
    ].join("\n");
    expect(parseConlluCanonical(itConllu, "libri", "it", 2)).toBe("il libro");
    expect(parseConlluCanonical(itConllu, "specchi", "it", 9)).toBe("lo specchio");
    expect(parseConlluCanonical(itConllu, "case", "it", 18)).toBe("la casa");
    expect(parseConlluCanonical(itConllu, "isole", "it", 24)).toBe("l'isola");
    expect(parseConlluCanonical(itConllu, "cadevano", "it", 30)).toBe("cadere");
    expect(parseConlluCanonical(itConllu, "belle", "it", 39)).toBe("bello");

    const enConllu = [
      "1\tThe\tthe\tDET\tDT\t_\t2\tdet\t_\tTokenRange=0:3",
      "2\tchildren\tchild\tNOUN\tNNS\tNumber=Plur\t3\tnsubj\t_\tTokenRange=4:12",
      "3\tspoke\tspeak\tVERB\tVBD\tMood=Ind|Tense=Past\t0\troot\t_\tTokenRange=13:18",
      "4\tbigger\tbig\tADJ\tJJR\tDegree=Cmp\t2\tamod\t_\tTokenRange=19:25",
    ].join("\n");
    expect(parseConlluCanonical(enConllu, "children", "en", 4)).toBe("child");
    expect(parseConlluCanonical(enConllu, "spoke", "en", 13)).toBe("speak");
    expect(parseConlluCanonical(enConllu, "bigger", "en", 19)).toBe("big");

    const ruConllu = [
      "1\tОн\tон\tPRON\t_\tCase=Nom|Number=Sing\t2\tnsubj\t_\tTokenRange=0:2",
      "2\tсказал\tсказать\tVERB\t_\tMood=Ind|Number=Sing|Tense=Past\t0\troot\t_\tTokenRange=3:9",
      "3\tдрузьям\tдруг\tNOUN\t_\tCase=Dat|Gender=Masc|Number=Plur\t2\tiobj\t_\tTokenRange=10:17",
      "4\tстарым\tстарый\tADJ\t_\tCase=Dat|Number=Plur\t3\tamod\t_\tTokenRange=18:24",
    ].join("\n");
    expect(parseConlluCanonical(ruConllu, "сказал", "ru", 3)).toBe("сказать");
    expect(parseConlluCanonical(ruConllu, "друзьям", "ru", 10)).toBe("друг");
    expect(parseConlluCanonical(ruConllu, "старым", "ru", 18)).toBe("старый");

    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ result: deConllu }) });
    vi.stubGlobal("fetch", fetchMock);
    await expect(canonicalizeWord("Bücher", "Die Bücher lagen auf den Tischen.", "de", 4)).resolves.toBe("das Buch");
    await expect(canonicalizeWord("machten auf", "Die Katzen machten die Tür auf.", "de", 48)).resolves.toBe("aufmachen");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(String(fetchMock.mock.calls[0][0])).toContain("lindat.mff.cuni.cz/services/udpipe/api/process");
  });
  it("disambiguates word and word-group translations by scanning the translated sentence context", () => {
    expect(
      selectContextualTranslation(
        "bank",
        ["bench", "seat"],
        "He sat on the bench in the park.",
        "en",
      ),
    ).toBe("bench");
    expect(
      selectContextualTranslation(
        "the bank",
        ["bench", "seat"],
        "The old benches stood in the park.",
        "en",
      ),
    ).toBe("the bench");
    expect(
      selectContextualTranslation(
        "to assume",
        ["accept", "adopt", "suppose"],
        "He gratefully accepted the offer.",
        "en",
      ),
    ).toBe("to accept");
    expect(
      selectContextualTranslation(
        "move",
        ["move towards", "walk"],
        "I move myself towards the exit.",
        "en",
      ),
    ).toBe("move towards");
  });
});

describe("article extraction and fallbacks", () => {
  it("uses the old option (backend endpoint) first when available", async () => {
    const backendData = {
      title: "Backend Title",
      text: "Content extracted by the backend.",
      url: "https://example.com/story",
      language: "en",
    };
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.startsWith("/api/article")) {
        return { ok: true, json: async () => backendData };
      }
      return { ok: false };
    });
    vi.stubGlobal("fetch", fetchMock);

    const article = await importArticle("https://example.com/story");
    expect(article).toEqual(backendData);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toContain("/api/article");
  });

  beforeEach(() => {
    if (!globalThis.DOMParser) {
      globalThis.DOMParser = new JSDOM().window.DOMParser;
    }
  });

  it("extracts clean title and text from HTML via Readability", () => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head><title>My Article Title</title></head>
<body>
  <header>Site Header</header>
  <nav><a href="/">Home</a></nav>
  <main>
    <article>
      <h1>My Article Title</h1>
      <p>First paragraph of the story.</p>
      <p>Second paragraph with more details.</p>
    </article>
  </main>
  <footer>Copyright 2026</footer>
</body>
</html>`;
    const result = extractArticleFromHtml(html, "https://example.com/news/123");
    expect(result.title).toContain("My Article Title");
    expect(result.text).toContain("First paragraph of the story.");
    expect(result.text).toContain("Second paragraph with more details.");
    expect(result.text).not.toContain("Site Header");
    expect(result.text).not.toContain("Copyright 2026");
    expect(result.url).toBe("https://example.com/news/123");
    expect(result.language).toBe("en");
  });

  it("falls back to public CORS proxy when local backend fails (Fix 1)", async () => {
    const sampleHtml = `<!DOCTYPE html><html><head><title>CORS Story</title></head><body><article><p>Story content fetched via CORS proxy gateway.</p></article></body></html>`;
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.startsWith("/api/article")) {
        return { ok: false, status: 404 };
      }
      if (url.startsWith("https://api.allorigins.win/raw")) {
        return { ok: true, text: async () => sampleHtml };
      }
      return { ok: false };
    });
    vi.stubGlobal("fetch", fetchMock);

    const article = await importArticle("https://example.com/story");
    expect(article.title).toBe("CORS Story");
    expect(article.text).toBe("Story content fetched via CORS proxy gateway.");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("falls back to Gemini extraction when local backend and CORS proxies fail (Fix 2)", async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.startsWith("/api/article")) {
        return { ok: false, status: 502 };
      }
      if (url.startsWith("https://api.allorigins.win") || url.startsWith("https://corsproxy.io")) {
        return { ok: false, status: 503 };
      }
      if (url.startsWith("/api/gemini")) {
        return {
          ok: true,
          json: async () => ({
            title: "Gemini Extracted Title",
            text: "Article text extracted directly by Gemini LLM.",
            language: "de",
          }),
        };
      }
      return { ok: false };
    });
    vi.stubGlobal("fetch", fetchMock);

    const article = await importArticle("https://example.com/blocked-story", undefined, "user-gemini-key");
    expect(article.title).toBe("Gemini Extracted Title");
    expect(article.text).toBe("Article text extracted directly by Gemini LLM.");
    expect(article.language).toBe("de");
  });
});
