import { afterEach, describe, expect, it, vi } from "vitest";
import { canonicalizeWord, collectArticleWords, importArticle, parseConlluCanonical, selectContextualTranslation, sentenceAt, wordParts } from "./article";
import { seedPair } from "../i18n/seedData";

afterEach(() => vi.unstubAllGlobals());
describe("article text and collection", () => {
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
