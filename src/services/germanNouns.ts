export type GermanGender = "Masc" | "Fem" | "Neut";
const genders = new Map<string, GermanGender>();
for (const [gender, words] of [
  ["Masc", "mann vater bruder sohn junge freund mensch lehrer arzt bahnhof tisch stuhl schlüssel wald apfel vogel mantel garten fuß reichtum tag monat morgen abend zug bus fluss see teil moment computer bildschirm drucker fehler leiter name gedanke glaube buchstabe käse kaffee tee zucker löffel teller euro kilometer wind regen schnee hund baum kopf arm finger schuh berg weg beruf zweck unterschied zusammenhang eingang ausgang aufzug preis vertrag besuch versuch bericht bereich chef direktor autor student tourist motor teppich spiegel himmel lärm frieden norden süden osten westen tor band"],
  ["Fem", "frau mutter schwester tochter tür straße nacht hand bank katze sprache schule aufgabe möglichkeit arbeit zeit welt stadt familie reise fahrkarte straßenbahn freiheit erfahrung veränderung antwort frage nummer uhr woche minute sekunde zukunft natur kultur musik technik türkei universität wohnung küche flasche tasse gabel zeitung information bahn kirche blume sonne luft milch butter maus wand decke ecke grenze sache geschichte hilfe ruhe freude angst kraft zahl regel insel brücke tasche lampe hose jacke karte stunde see band"],
  ["Neut", "haus buch kind mädchen schloss glas grab herz smartphone telefon handy auto foto kino radio büro bett zimmer fenster wasser brot geld wort jahr auge ohr bein haar gesicht messer land dorf meer tor band teil moment wissen gleichgewicht selbstvertrauen frühstück wochenende geburtstagsgeschenk krankenhaus flugzeug flughafengebäude obst gemüse fleisch ei bier salz öl mehl papier licht bild spiel leben essen problem thema system programm museum zentrum datum stadium ergebnis ereignis verhältnis geheimnis zeugnis bedürfnis verhalten kleid hemd sofa beispiel abenteuer geschenk geschäft"],
] as const) for (const word of words.split(" ")) if (!genders.has(word)) genders.set(word, gender);
// Default senses; explicit contextual gender features still take precedence.
genders.set("tor", "Neut");
genders.set("band", "Neut");

const irregular: Record<string, string> = {
  bücher: "Buch", tische: "Tisch", tischen: "Tisch", häuser: "Haus", häusern: "Haus", hauses: "Haus",
  wälder: "Wald", äpfel: "Apfel", vögel: "Vogel", mäntel: "Mantel", gärten: "Garten",
  mütter: "Mutter", väter: "Vater", brüder: "Bruder", schlösser: "Schloss", gläser: "Glas",
  gräber: "Grab", nächte: "Nacht", söhne: "Sohn", füße: "Fuß", reichtümer: "Reichtum", herzen: "Herz",
};

export function normalizeGermanNoun(form: string, lemma: string, plural: boolean): string {
  const lower = form.toLocaleLowerCase("de");
  const known = irregular[lower] ?? (plural && lower.endsWith("n") ? irregular[lower.slice(0, -1)] : undefined);
  let result = known ?? (lemma && !["_", "unknown"].includes(lemma.toLowerCase()) ? lemma : form);
  if (!known && plural && result.toLocaleLowerCase("de") === lower) {
    // Prefer a known base before conservative suffix removal for loanwords.
    const candidates = [lower.replace(/en$/u, ""), lower.replace(/n$/u, ""), lower.replace(/e$/u, ""), lower.replace(/s$/u, "")];
    result = candidates.find((candidate) => genders.has(candidate)) ?? result.replace(/s$/u, "");
  }
  if (form.includes("ß") && !result.includes("ß")) result = result.replace(/ss/u, "ß");
  return result.charAt(0).toLocaleUpperCase("de") + result.slice(1);
}

export function guessGermanGender(singular: string): GermanGender {
  const lower = singular.toLocaleLowerCase("de");
  const exact = genders.get(lower);
  if (exact) return exact;
  // Prefer the longest lexical head, e.g. Haustür, Bahnhofsuhr, Arbeitstisch.
  const head = [...genders.keys()].filter((word) => word.length >= 3 && lower.endsWith(word)).sort((a, b) => b.length - a.length)[0];
  if (head) return genders.get(head)!;
  if (/(?:chen|lein|ment|um|tum|nis|ma|o)$/u.test(lower) || /^ge.+e$/u.test(lower)) return "Neut";
  if (/(?:ling|ismus|ig|ich|or|er|el|en|ant|ent|ist|eur)$/u.test(lower)) return "Masc";
  if (/(?:ung|heit|keit|schaft|tät|ion|ik|enz|anz|ie|ei|ur|in|e)$/u.test(lower)) return "Fem";
  // Gender cannot be guaranteed for an unknown noun without a dictionary.
  // Keep an article available; Gemini/contextual morphology takes precedence.
  return "Masc";
}
