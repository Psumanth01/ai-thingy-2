/* =========================================================
   AI Quest — curriculum data
   All lessons, challenges, quizzes, daily challenges and games live here.
   The activity player (player.js) turns each "step" into an interactive screen.
   Step types: info · reveal · mcq · sort · match · spot · builder · explore · reflect · rapid
   ========================================================= */
window.AIQ_DATA = (function () {
  "use strict";

  /* ---------- XP table (matches the AI Quest design brief) ---------- */
  var XP = { lesson: 50, quiz: 100, challenge: 75, module: 200, daily: 25, final: 300 };

  /* ---------- tiny helpers to keep the content readable ---------- */
  function I(title, body, say, mood) { return { t: "info", title: title, body: body || "", say: say || "", mood: mood || "happy" }; }
  function R(title, intro, cards) { return { t: "reveal", title: title, intro: intro || "", cards: cards }; }
  function Q(q, opts, a, why, extra) {
    var s = { t: "mcq", q: q, opts: opts, a: a, why: why || "" };
    if (extra) for (var k in extra) s[k] = extra[k];
    return s;
  }
  function TF(q, answer, why) { return { t: "mcq", q: q, opts: ["True", "False"], a: answer ? 0 : 1, why: why, style: "tf" }; }
  function SORT(q, buckets, items, after) { return { t: "sort", q: q, buckets: buckets, items: items, after: after || "" }; }
  function MATCH(q, pairs) { return { t: "match", q: q, pairs: pairs }; }
  function SPOT(q, sentences, intro) { return { t: "spot", q: q, intro: intro || "", sentences: sentences }; }
  function BUILD(q, scenario, slots) { return { t: "builder", q: q, scenario: scenario, slots: slots }; }

  /* ---------- Badges ---------- */
  var BADGES = [
    { id: "explorer",  name: "AI Explorer",   desc: "Complete Module 1: AI Foundations",                color: "#3C75A6", glyph: "compass" },
    { id: "detective", name: "AI Detective",  desc: "Finish the Spot the Error knowledge check",        color: "#6C80C8", glyph: "magnifier" },
    { id: "promptpro", name: "Prompt Pro",    desc: "Complete the Improve a Prompt challenge",          color: "#CB6CE6", glyph: "sparkle" },
    { id: "guardian",  name: "AI Guardian",   desc: "Complete Module 4: Responsible AI",                color: "#FF914D", glyph: "shield" },
    { id: "navigator", name: "AI Navigator",  desc: "Finish all four modules and the Final Application", color: "#1E2A52", glyph: "star" },
    { id: "firststep", name: "First Steps",   desc: "Complete your very first activity",                color: "#2FB67C", glyph: "flag" },
    { id: "onfire",    name: "On Fire",       desc: "Learn three days in a row",                        color: "#FF914D", glyph: "flame" },
    { id: "sharp",     name: "Sharp Mind",    desc: "Get a perfect score on any knowledge check",       color: "#6C80C8", glyph: "bolt" },
    { id: "dailydoer", name: "Daily Doer",    desc: "Complete 5 daily challenges",                      color: "#CB6CE6", glyph: "calendar" },
    { id: "arcade",    name: "Arcade Ace",    desc: "Score 80% or better in any game",                  color: "#3C75A6", glyph: "gamepad" }
  ];

  /* =========================================================
     MODULE 1 — AI Foundations  (Level 1: Introduction to AI)
     ========================================================= */
  var m1Lesson = [
    I("Welcome to Level 1",
      "<p>By the end of this lesson you will be able to explain what AI is, how machine learning works, and what AI can and can’t do.</p>",
      "Hi, I’m Byte! I’ll be your guide. First question: when your phone suggests the next word in a text, is that artificial intelligence?", "wave"),
    I("So… what is AI?",
      "<p><span class='keyterm'>Artificial intelligence (AI)</span> is technology that lets computers do tasks that normally need human intelligence, like recognizing faces, understanding speech, making predictions, or writing text.</p>" +
      "<ul><li>Your phone unlocks when it <b>recognizes</b> your face.</li><li>A map app <b>predicts</b> traffic.</li><li>A chatbot <b>generates</b> an answer to your question.</li></ul>" +
      "<div class='callout'>So yes, predicting your next word counts! AI isn’t one single invention. It’s a toolbox of techniques.</div>",
      "Yes! Predicting your next word is AI. Let’s see what’s going on under the hood.", "happy"),
    R("Four words you’ll hear everywhere", "Tap each card to flip it.", [
      { icon: "bulb", front: "Artificial intelligence", back: "The big umbrella: computer systems that perform tasks we usually link with human intelligence." },
      { icon: "chart", front: "Machine learning (ML)", back: "A way to build AI where the computer finds <b>patterns in examples</b> instead of only following hand-written rules." },
      { icon: "db", front: "Data", back: "The examples an AI learns from: photos, text, numbers, sounds. More varied, high-quality data usually means a better AI." },
      { icon: "spark", front: "Generative AI", back: "AI that <b>creates new content</b> (text, images, audio, code) based on patterns it learned from lots of examples." }
    ]),
    I("Rules vs. learning",
      "<div class='callout warn'><b>Old-school program:</b> a programmer writes every rule. “If the email says WINNER, mark it as spam.” Scammers just change the word.</div>" +
      "<div class='callout good'><b>Machine learning:</b> show the computer thousands of emails labeled <i>spam</i> or <i>not spam</i>. It finds patterns (odd links, pushy wording, strange senders) and uses them on brand-new emails.</div>" +
      "<p>Ready to try it? Next, <b>you’re the trainer</b>.</p>",
      "Machines can learn from examples, kind of like you learn from practice.", "think"),
    SORT("Teach the spam filter: label each message.", ["Spam", "Not spam"], [
      { x: "URGENT!!! You WON a free phone. Click here NOW", b: 0, why: "Pressure, prizes and “click now” are classic spam patterns." },
      { x: "Hey, are we still meeting for the group project at 4?", b: 1, why: "Normal conversation from someone you know." },
      { x: "Your account is locked. Verify your password at secure-login-bank.biz", b: 0, why: "Asking for passwords through a strange link is a phishing pattern." },
      { x: "Reminder: the chemistry quiz moved to Thursday", b: 1, why: "A normal school message." },
      { x: "Make $5,000 a week from home. No experience needed!", b: 0, why: "“Too good to be true” offers are a spam pattern." },
      { x: "Here are today’s class notes. Tell me if I missed anything.", b: 1, why: "A friendly, specific message with no pressure." }
    ], "You just did what a machine learning model does: you used examples to spot patterns. A real model studies <b>thousands</b> of them."),
    I("How does a chatbot “write”?",
      "<p>Chatbots are powered by <span class='keyterm'>large language models (LLMs)</span>. An LLM studied huge amounts of text and learned which words are likely to come next. Think of your phone’s autocomplete, but far more powerful.</p>" +
      "<div class='callout warn'><b>Big idea:</b> predicting likely words is not the same as <i>knowing</i> facts. A chatbot can sound confident and still be wrong. We’ll dig into that in Level 2.</div>" +
      "<p>Some chatbots can also use tools like web search. That can help, but you still need to check the results.</p>",
      "Autocomplete, but supercharged!", "think"),
    R("The 5 Big Ideas of AI", "Researchers at the AI4K12 Initiative organize what students should know about AI into five big ideas. Tap to explore each one.", [
      { icon: "eye", front: "1. Perception", back: "Computers “sense” the world with cameras, microphones and other sensors, then try to make sense of it (like recognizing a face or speech)." },
      { icon: "map", front: "2. Representation & reasoning", back: "AI stores information in organized ways and uses it to reason, like a map app finding the fastest route." },
      { icon: "chart", front: "3. Learning", back: "Computers can learn from data. This is <b>machine learning</b>, and it’s behind many tools you use." },
      { icon: "chat", front: "4. Natural interaction", back: "To talk and work with people naturally, AI needs many abilities, like understanding language and context." },
      { icon: "globe", front: "5. Societal impact", back: "AI can affect jobs, fairness, privacy and safety, for better or worse. That’s why Levels 2 and 4 matter." }
    ]),
    I("Today’s AI is “narrow”",
      "<p>Every AI you can use today is <span class='keyterm'>narrow AI</span>: it’s good at specific jobs. A chess AI can’t write a poem. A photo-sorting AI can’t hold a conversation.</p>" +
      "<p>AI doesn’t have feelings, goals or common sense the way people do. The robot that thinks like a human is <b>science fiction</b>, not what we have today.</p>" +
      "<div class='callout good'><b>Lesson complete!</b> Next up: a challenge where you hunt for AI in your own day.</div>",
      "You now know the foundations. Time to put them to work!", "cheer")
  ];

  var m1Challenge = [
    I("Mission: find AI in everyday life",
      "<p>AI is hiding in plain sight. Your mission has two parts: spot where you meet it on a normal day, then answer two quick questions.</p>",
      "Let’s go on an AI scavenger hunt!", "think"),
    { t: "explore", key: "m1explore", title: "Where have you noticed AI?",
      intro: "Check at least <b>three</b> places you personally use or see in a normal week.",
      checks: ["Face unlock on a phone", "“Recommended for you” videos or music", "Maps and traffic predictions", "Autocomplete and predictive text",
               "Voice assistants and voice typing", "Photo apps that group faces or search for “dog”", "Social media feeds choosing what you see",
               "Online shopping suggestions", "Email spam filters", "Live captions and translation"],
      minChecks: 3,
      prompt: "Pick one you checked. What do you think the AI is recognizing or predicting? (1–2 sentences)", minChars: 20 },
    Q("Which of these is an example of <b>generative</b> AI?",
      ["A map app predicting traffic", "A chatbot writing a short story from your prompt", "A spam filter sorting email", "Face unlock on a phone"], 1,
      "Generative AI <b>creates new content</b>, like text, images, audio or code. The others recognize or predict, but don’t create something new."),
    Q("Your music app suggests songs based on what you’ve listened to. What is it using?",
      ["A human DJ choosing for each user", "Patterns learned from data about listening habits", "Random guessing", "A list of rules with every song pre-assigned to every person"], 1,
      "Recommendation systems use machine learning to find patterns in data about what people listen to, then predict what you might like.", { shuffle: true })
  ];

  var m1Quiz = [
    Q("Which best describes <b>machine learning</b>?",
      ["A computer following only rules a programmer wrote by hand", "A computer finding patterns in examples to make predictions", "A robot that thinks and feels like a person", "A program that copies answers from the internet"], 1,
      "Machine learning means the computer learns <b>patterns from examples (data)</b> instead of relying only on hand-written rules."),
    MATCH("Match each term to its meaning.", [
      ["Data", "The examples an AI learns from"],
      ["Machine learning", "Finding patterns in examples"],
      ["Generative AI", "AI that creates new text, images or audio"],
      ["Narrow AI", "AI that is good at specific tasks only"]
    ]),
    TF("A chatbot works by looking up the correct answer in a database of facts every single time.", false,
      "Most chatbots generate text by predicting likely words from patterns. Some can use search tools, but sounding right isn’t the same as being right."),
    SORT("AI or Not AI? Sort each example.", ["AI", "Not AI"], [
      { x: "Face unlock on a phone", b: 0, why: "It recognizes patterns in images of your face." },
      { x: "A digital alarm clock", b: 1, why: "It just follows a fixed rule: ring at the set time." },
      { x: "A voice assistant turning your speech into text", b: 0, why: "Speech recognition learns from lots of audio examples." },
      { x: "A light switch", b: 1, why: "A simple on/off mechanism, with no learning involved." },
      { x: "“Recommended for you” on a streaming app", b: 0, why: "It predicts what you’ll like from patterns in data." },
      { x: "A calculator adding two numbers", b: 1, why: "It follows fixed math rules and doesn’t learn." }
    ]),
    Q("Why does a bigger, more varied set of training data usually help an AI?",
      ["It lets the AI see more patterns and more kinds of examples", "It makes the AI run on cheaper computers", "It makes the AI feel emotions", "It guarantees the AI is never wrong"], 0,
      "More varied examples help an AI learn patterns that work in more situations. But it never <i>guarantees</i> perfection.", { shuffle: true }),
    Q("Which statement about today’s AI is true?",
      ["It understands the world exactly like a human", "It is “narrow”: good at specific tasks but not general common sense", "It is always correct", "It can feel and want things"], 1,
      "Today’s AI is narrow AI. It can be impressive at specific jobs, but it doesn’t have human-style understanding.", { shuffle: true })
  ];

  /* =========================================================
     MODULE 2 — Understanding AI  (Level 2: Assessing AI)
     ========================================================= */
  var m2Lesson = [
    I("Welcome to Level 2",
      "<p>In this lesson you’ll learn why AI makes mistakes, what <b>hallucinations</b> and <b>bias</b> are, and a simple routine to check AI before you trust it.</p>",
      "AI sounds so sure of itself. But sounding sure and being right are two different things!", "think"),
    I("Why do AI mistakes happen?",
      "<ul><li><b>It predicts, it doesn’t “know.”</b> It picks likely-sounding words, not guaranteed-true ones.</li>" +
      "<li><b>Its data has gaps.</b> It may be out of date, or know little about niche topics.</li>" +
      "<li><b>Your question may be unclear.</b> Vague prompts lead to guesses.</li>" +
      "<li><b>It may fill in blanks</b> instead of saying “I don’t know.”</li></ul>",
      "Mistakes aren’t rare glitches. They come from how AI works.", "think"),
    I("Hallucinations",
      "<p>A <span class='keyterm'>hallucination</span> is when AI produces information that sounds believable but is false or made up, like an invented quote, a wrong date, or a source that doesn’t exist.</p>" +
      "<div class='chat'><div class='msg user'><small>You</small>Give me a source about how sleep affects test scores.</div>" +
      "<div class='msg ai'><small>Chatbot (invented example)</small>Sure! See Dr. Maria Chen’s 2019 study, “Sleep and Academic Performance in Teens,” in the Journal of Adolescent Learning, Vol. 12.</div></div>" +
      "<div class='callout warn'>This example is made up, but AI really can produce fake-looking citations: real-sounding authors, journals and volume numbers that don’t exist. <b>Always open the source and check.</b></div>",
      "Looks legit, right? That’s exactly the problem.", "oops"),
    R("Red flags: when an answer needs checking", "Tap each card to see why it’s a warning sign.", [
      { icon: "link", front: "Specific, but no link", back: "Exact numbers, names or quotes with no way to verify them." },
      { icon: "search", front: "Sources you can’t find", back: "Search the title or author. If nothing real shows up, treat it as unreliable." },
      { icon: "target", front: "A suspiciously perfect fit", back: "An answer that matches your question a little too well, especially on an obscure topic." },
      { icon: "mic", front: "Confident tone", back: "A confident tone is a writing style, <b>not proof</b> of accuracy." }
    ]),
    I("Bias in AI",
      "<p><span class='keyterm'>Bias</span> in AI means results that are systematically unfair or skewed toward or against certain people or ideas. AI learns from data created by people, so if the data is unbalanced or reflects stereotypes, the AI can repeat them.</p>" +
      "<ul><li>A hiring tool trained mostly on past hires from one group might rank similar people higher. <i>(A realistic example.)</i></li>" +
      "<li>Researchers have found some face-analysis systems were less accurate for some groups of people, partly because of unbalanced training data.</li>" +
      "<li>A voice assistant trained mostly on one accent may misunderstand others.</li></ul>" +
      "<div class='callout'>Bias doesn’t mean the AI “wants” anything. It’s a pattern that comes from the data and from choices people made when building it.</div>",
      "Fair AI starts with fair data and careful people.", "think"),
    SORT("Hallucination, bias, or neither?", ["Hallucination", "Bias", "Neither"], [
      { x: "A chatbot cites a study that doesn’t exist", b: 0, why: "Made-up information that sounds real is a hallucination." },
      { x: "A speech tool understands one accent far better than others because of its training data", b: 1, why: "Skewed training data leading to unfair results is bias." },
      { x: "A calculator app shows 12 for 3 × 4", b: 2, why: "That’s correct, so there’s no error at all." },
      { x: "A chatbot states a wrong date for a historical event with total confidence", b: 0, why: "A confident false fact is a hallucination." },
      { x: "A photo AI works well for some skin tones and poorly for others", b: 1, why: "Unequal performance across groups is a sign of bias." }
    ]),
    I("The 3-Check Rule",
      "<p>Before you trust or use anything an AI tells you, run these checks:</p>" +
      "<ol><li><b>Source check:</b> where did this come from? Open the link or search the title. Does the source exist and really say this?</li>" +
      "<li><b>Second-source check:</b> can you confirm it with at least one other trustworthy source (textbook, library database, reputable news, .gov or .edu sites)?</li>" +
      "<li><b>Sense check:</b> does it match what you already know or what your teacher taught? If something feels off, dig deeper.</li></ol>" +
      "<div class='callout good'>The higher the stakes (grades, health, money, law), the more checking you should do. AI is a draft partner. <b>You’re the editor.</b></div>",
      "Source, second source, sense. Three checks, every time!", "cheer")
  ];

  var m2Challenge = [
    I("Scenario: handle incorrect AI information",
      "<p>You’ll face three short situations. Pick the best move in each one. If you miss one, you’ll get another try at the end.</p>",
      "Detective mode: ON.", "think"),
    Q("What’s your best move?",
      [
        { x: "Use the chatbot’s version. It gave more detail than the textbook.", fb: "More detail isn’t the same as more accuracy. When sources disagree, you need to find out which one is right." },
        { x: "Check the textbook and one more trusted source, fix the date, and double-check the other facts too.", fb: "One wrong fact is a sign to check the rest. Using independent sources is exactly the 3-Check Rule." },
        { x: "Ask the chatbot “Are you sure?” and go with whatever it says next.", fb: "Asking again can help you notice problems, but the chatbot may just change its answer. It isn’t a reliable fact-checker, so use independent sources." },
        { x: "Delete the date from the slide and hope nobody notices.", fb: "That hides one error but doesn’t fix the problem. The other facts could be wrong too." }
      ], 1, "Verify with independent sources, fix the error, and check the rest of the AI’s facts.",
      { situation: "You asked a chatbot for key facts about the Industrial Revolution for a presentation due tomorrow. One date it gave doesn’t match your textbook. The rest look fine.", tag: "Situation 1" }),
    Q("How do you respond?",
      [
        { x: "Agree. It’s just one fact.", fb: "A single caught error is a clue that other errors may be hiding. Better to check than to hope." },
        { x: "Explain that one error means the other facts need checking, and offer to split up the fact-checking.", fb: "That’s teamwork and good judgment: you’re protecting the group’s grade and making the task manageable." },
        { x: "Tell your friend AI is useless and should never be used.", fb: "AI can be useful when you check it. The goal is smart use, not never using it." },
        { x: "Say nothing and re-do the whole project alone.", fb: "Quietly doing everything yourself isn’t necessary. Sharing the checking is faster and fairer." }
      ], 1, "Calmly explain why checking matters and share the work.",
      { situation: "You find the chatbot’s date was wrong. Your friend says, “Whatever, it’s just one mistake. Nobody checks these things.”", tag: "Situation 2" }),
    Q("What’s the right way to credit your facts?",
      [
        { x: "Cite the chatbot as if it were an encyclopedia.", fb: "A chatbot isn’t the original source of facts. Cite the reliable sources you actually used to verify them." },
        { x: "Cite nothing, because AI helped.", fb: "Facts you use still need sources, and your teacher may want to know about your AI use." },
        { x: "Cite the reliable sources you verified, and mention the AI tool if your teacher asks you to.", fb: "Cite what you verified, and be transparent about AI when your class requires it." },
        { x: "Make up a source that sounds right.", fb: "Never invent sources. That’s dishonest, and it’s exactly the hallucination problem you just learned about." }
      ], 2, "Cite verified sources, and follow your teacher’s rules about disclosing AI.",
      { situation: "Your slides are done. Now you need a sources slide.", tag: "Situation 3" })
  ];

  var m2Quiz = [
    SPOT("Read this AI-written study guide. Tap every sentence that contains an <b>error</b>.", [
      { x: "The Sun is a star at the center of our solar system.", wrong: false },
      { x: "Saturn is the largest planet in the solar system.", wrong: true, fix: "Jupiter is the largest planet." },
      { x: "Light from the Sun takes about 8 minutes to reach Earth.", wrong: false },
      { x: "Mars is the closest planet to the Sun.", wrong: true, fix: "Mercury is the closest planet to the Sun." },
      { x: "Earth is the third planet from the Sun.", wrong: false },
      { x: "The Moon orbits Earth.", wrong: false }
    ], "AI-generated “Solar System Quick Facts”"),
    Q("An AI answer includes this citation: “Dr. Lee et al. (2021), <i>Journal of Teen Brain Science</i>, p. 88.” What should you do first?",
      ["Copy it into your bibliography. It looks professional.", "Search for the article and journal to see if they really exist.", "Assume it’s real because it has a page number.", "Ask the AI to promise it’s real."], 1,
      "Detailed-looking citations can still be invented. Search for the source before you rely on it.", { shuffle: true }),
    Q("A voice assistant understands some accents much less accurately than others. What’s the most likely cause?",
      ["The assistant dislikes certain accents", "Its training data didn’t include enough variety of voices", "The microphone is too expensive", "The accents are “too hard” for computers"], 1,
      "Bias often comes from training data that doesn’t represent everyone well.", { shuffle: true }),
    TF("If an AI answer is long, detailed and confident, it must be correct.", false,
      "Confidence and detail are style, not proof. Always verify important facts."),
    Q("You’re writing about an event that happened last week. Why might a chatbot get it wrong?",
      ["Chatbots can’t read news", "Its training data may not include very recent events, so it might guess", "It purposely hides recent news", "Recent events are always inaccurate"], 1,
      "Models are trained up to a point in time. Tools like web search can help, but you should still verify.", { shuffle: true }),
    Q("You need a statistic for your report. What’s the best approach?",
      ["Use the number the AI gave, since it sounds specific", "Find the original study or a reliable source and confirm the number", "Round it up to make your point stronger", "Ask a friend if it sounds right"], 1,
      "Trace statistics back to the original or a trustworthy source. That’s the source check.", { shuffle: true })
  ];

  /* =========================================================
     MODULE 3 — Applying AI  (Level 3: Applying AI)
     ========================================================= */
  var m3Lesson = [
    I("Welcome to Level 3",
      "<p>You know what AI is and where it slips. Now you’ll learn to <b>use it well</b>: choosing the right tool, writing strong prompts, and keeping your own brain in the driver’s seat.</p>",
      "Time to put AI to work, the smart way!", "wave"),
    R("A tour of AI tools you might meet", "Tap a category to see where it shines and what to watch out for.", [
      { icon: "chat", front: "Chatbots & assistants", back: "<b>Great for:</b> brainstorming, explaining ideas in different ways, practice questions.<br><b>Watch out for:</b> confident mistakes and made-up sources." },
      { icon: "pen", front: "Writing & grammar helpers", back: "<b>Great for:</b> catching typos and tightening sentences in <i>your</i> draft.<br><b>Watch out for:</b> losing your own voice, or accepting every suggestion blindly." },
      { icon: "search", front: "Research & search assistants", back: "<b>Great for:</b> summarizing pages and pointing you to sources.<br><b>Watch out for:</b> summaries that miss nuance. Click through and read the sources." },
      { icon: "cards", front: "Study tools", back: "<b>Great for:</b> turning your notes into flashcards and practice quizzes.<br><b>Watch out for:</b> check the answers against your notes or textbook." },
      { icon: "image", front: "Image & media generators", back: "<b>Great for:</b> illustrations and creative projects.<br><b>Watch out for:</b> copyright, fake-looking people, and disclosure rules." },
      { icon: "code", front: "Coding assistants", back: "<b>Great for:</b> explaining errors and suggesting fixes.<br><b>Watch out for:</b> code that looks right but has bugs. Test everything." },
      { icon: "ear", front: "Accessibility tools", back: "<b>Great for:</b> speech-to-text, text-to-speech, captions and translation.<br><b>Watch out for:</b> check accuracy for names and technical terms." }
    ]),
    I("A tutor, not a shortcut",
      "<p>The best way to use AI for school: let it help you <b>learn</b>, not do the learning for you. Sort these examples to see the difference.</p>",
      "Same tool, very different results!", "think"),
    SORT("Learning boost or shortcut?", ["Learning boost", "Shortcut (not OK)"], [
      { x: "Ask AI to quiz you on chapter 5 of your textbook", b: 0, why: "Practice questions strengthen your own memory." },
      { x: "Ask AI to explain a tough idea three different ways", b: 0, why: "Hearing it several ways builds understanding." },
      { x: "Paste in your assignment and submit the AI’s answer as your own", b: 1, why: "That’s not your work, and it skips the learning." },
      { x: "Ask for feedback on the thesis in your own draft", b: 0, why: "You’re still doing the thinking and using AI as a coach." },
      { x: "Use AI during a test when your teacher said no AI", b: 1, why: "It breaks the rules and academic integrity." },
      { x: "Brainstorm 10 topic ideas, then pick and research one yourself", b: 0, why: "AI sparks ideas, and you do the real work." }
    ], "Remember: your teacher or school decides what’s allowed. If you’re not sure, ask first."),
    I("Anatomy of a great prompt",
      "<p>A <span class='keyterm'>prompt</span> is the instruction you give an AI. Better prompts lead to better results. Use the <b>R-T-C-F</b> recipe:</p>" +
      "<ul><li><b>R: Role.</b> Who should the AI act as? <i>“Act as a patient chemistry tutor.”</i></li>" +
      "<li><b>T: Task.</b> What exactly do you want? <i>“Create 6 practice questions on balancing equations.”</i></li>" +
      "<li><b>C: Context.</b> What should it know? <i>“I’m in 10th grade, the test is Friday, and I struggle with coefficients.”</i></li>" +
      "<li><b>F: Format.</b> How should it look? <i>“Numbered list, easy to hard, answers at the end.”</i></li></ul>" +
      "<div class='chat'><div class='msg user'><small>Weak prompt</small>help me with chemistry</div>" +
      "<div class='msg user'><small>Strong prompt</small>Act as a patient chemistry tutor. I’m in 10th grade and my test on balancing equations is Friday. Create 6 practice questions, easy to hard, as a numbered list with answers at the end.</div></div>",
      "Role, Task, Context, Format. Say it with me!", "happy"),
    I("Your first prompt is just a draft",
      "<p>Treat AI like a conversation. Follow up to steer it:</p>" +
      "<ul><li><b>Too long?</b> “Summarize that in 5 bullets.”</li>" +
      "<li><b>Too hard?</b> “Explain it again like I’m new to this, with an example.”</li>" +
      "<li><b>Not what you wanted?</b> Say what’s missing: “Make it more formal and add a counterargument.”</li>" +
      "<li><b>Want to really learn?</b> “Don’t give me the answer. Ask me guiding questions instead.”</li></ul>",
      "Iterate, don’t just accept the first answer.", "think"),
    I("Protect yourself while you prompt",
      "<div class='callout warn'><b>Keep private info out of prompts:</b> your full name, address, phone number, passwords, other people’s personal details, or anything you wouldn’t post publicly. Treat what you type as <b>not fully private</b>.</div>" +
      "<p>We’ll go deeper on this in Level 4. For now, you’re ready for the Prompt Challenge!</p>",
      "Smart prompting is safe prompting.", "wow")
  ];

  var m3Challenge = [
    I("Prompt challenge: improve a prompt",
      "<p>Your mission: turn weak prompts into strong ones. In each round, pick the improved prompt that uses <b>Role, Task, Context and Format</b>. Then you’ll build a full prompt yourself.</p>",
      "Let’s level up your prompts!", "wave"),
    Q("Pick the best improvement.",
      [
        { x: "Make a better study guide please.", fb: "That’s still vague. The AI doesn’t know the subject, level or format." },
        { x: "Make a study guide for my biology test about cells. Make it good and long.", fb: "Better, but “good and long” isn’t specific, and there’s no role or format." },
        { x: "Act as a biology tutor. I’m in 9th grade with a test on cell organelles on Friday. Make a one-page study guide: each organelle with a one-sentence job and a memory trick.", fb: "Role, task, context and format are all here." },
        { x: "Study guide for biology!!! Be detailed.", fb: "Excitement isn’t detail. The AI still has to guess what you need." }
      ], 2, "Strong prompts include a role, a clear task, context and a format.",
      { style: "prompt", say: "make a study guide" }),
    Q("Pick the best improvement. (Remember: you want help, not a replacement for your own writing.)",
      [
        { x: "Rewrite my whole essay so it’s perfect.", fb: "That replaces your thinking and may break your school’s rules." },
        { x: "Act as a writing coach. Here’s my thesis: [paste]. Give me 3 specific ways to make it clearer and more arguable. Don’t rewrite it for me.", fb: "You keep ownership of your writing and get targeted feedback." },
        { x: "Make my essay better.", fb: "“Better” could mean anything. The AI will guess." },
        { x: "Fix grammar and everything else.", fb: "“Everything else” is vague and may change your ideas without you noticing." }
      ], 1, "Ask AI to coach your work with specific feedback. Don’t ask it to replace your work.",
      { style: "prompt", say: "Fix my essay." }),
    Q("Pick the best improvement.",
      [
        { x: "Explain derivatives to a high school student who knows basic algebra. Use one real-life example (like speed), then give me 3 practice problems and wait for my answers before showing solutions.", fb: "Audience, example, practice and a learning-friendly format are all included." },
        { x: "Tell me everything about derivatives.", fb: "“Everything” is overwhelming and unfocused." },
        { x: "Derivatives, but easy.", fb: "“Easy” depends on who’s asking. Say your level and what you need." },
        { x: "Do my calculus homework on derivatives.", fb: "That’s a shortcut. You wouldn’t learn the material, and it may break the rules." }
      ], 0, "Mention your level, ask for an example, and request practice so you actually learn.",
      { style: "prompt", say: "Explain derivatives.", shuffle: true }),
    BUILD("Build a prompt: choose one piece for each part.", "You have a quiz on photosynthesis next week and want to practice.", [
      { label: "Role", options: [
        { x: "Act as a patient biology tutor.", good: true, why: "A clear role sets the tone and expertise." },
        { x: "Act as my best friend.", why: "A friend doesn’t signal subject expertise." },
        { x: "You are an AI.", why: "That’s true of every chatbot, so it adds nothing." }
      ] },
      { label: "Task", options: [
        { x: "Quiz me with 5 questions, one at a time, and wait for my answer before giving feedback.", good: true, why: "Active practice is great for learning." },
        { x: "Tell me everything about photosynthesis.", why: "Too broad, and passive reading isn’t practice." },
        { x: "Do my homework on photosynthesis.", why: "That’s a shortcut instead of studying." }
      ] },
      { label: "Context", options: [
        { x: "I’m in 10th grade, my quiz is next week, and I keep mixing up the light reactions and the Calvin cycle.", good: true, why: "Level, deadline and the exact trouble spot help the AI aim well." },
        { x: "I’m a student.", why: "Too general to help." },
        { x: "It’s urgent!!!", why: "Urgency isn’t useful information." }
      ] },
      { label: "Format", options: [
        { x: "Keep each question short, mix multiple choice and short answer, and explain the right answer after I respond.", good: true, why: "A clear structure makes the practice useful." },
        { x: "Make it long.", why: "Long isn’t the same as useful." },
        { x: "Whatever format is fine.", why: "That hands all the decisions to the AI." }
      ] }
    ])
  ];

  var m3Quiz = [
    Q("Which prompt will most likely help you study for a Spanish vocabulary quiz?",
      ["Spanish words.", "Give me 15 beginner Spanish vocabulary words about food, with English meanings, in a table.", "Teach me all of Spanish.", "Do my Spanish worksheet."], 1,
      "It names the task, level, topic and format, and it supports learning.", { style: "prompt", shuffle: true }),
    MATCH("Match each part of the R-T-C-F recipe to what it does.", [
      ["Role", "Who the AI should act as"],
      ["Task", "What you want it to do"],
      ["Context", "Background like your grade level or goal"],
      ["Format", "How the answer should look (list, table, length)"]
    ]),
    Q("The AI’s answer is too complicated. What’s the best follow-up?",
      ["“That’s wrong.”", "“Explain that again in simpler words, in 5 bullets, with one example.”", "“Try harder.”", "Start a brand-new chat and give up on this topic."], 1,
      "A specific follow-up steers the AI toward what you need.", { shuffle: true }),
    TF("Adding context like your grade level and your goal usually makes AI answers more useful.", true,
      "Context helps the AI pitch its answer at the right level and focus on what you need."),
    Q("Which is the best way to use AI for a school task?",
      ["Paste the assignment and submit the answer", "Ask it to quiz you or give feedback on your own draft, then do the work yourself", "Ask it to invent sources so you don’t have to search", "Use it during a test without asking"], 1,
      "Use AI to support your learning while you do the thinking and follow the rules.", { shuffle: true }),
    Q("Which information is safest to include in a prompt?",
      ["Your home address", "Your friend’s full name and personal problems", "The topic of your assignment", "Your school login password"], 2,
      "Keep personal and private information out of prompts. The assignment topic is fine.", { shuffle: true })
  ];

  /* =========================================================
     MODULE 4 — Responsible AI  (Level 4: Responsible AI)
     ========================================================= */
  var m4Lesson = [
    I("Welcome to Level 4",
      "<p>You’ve learned what AI is, where it fails, and how to use it well. Now comes the big one: using AI with <b>integrity</b>, protecting people, and making good choices.</p>",
      "With great tools comes great responsibility!", "wave"),
    I("Be honest about AI",
      "<p><span class='keyterm'>Academic integrity</span> means your work shows your own thinking and you’re honest about where help came from. Replacing your learning with AI, or hiding AI use when you’re supposed to share it, can count as cheating, even if no one catches you.</p>" +
      "<ul><li>Follow your teacher’s and school’s AI rules. They can differ from class to class.</li>" +
      "<li>When it’s allowed, say how you used AI (“I used AI to brainstorm topics and check grammar”).</li>" +
      "<li>If you’re unsure, <b>ask before you use it</b>.</li></ul>" +
      "<div class='callout'>A good test: would you be comfortable showing your teacher your chat history? If not, rethink what you’re doing.</div>",
      "Honesty is the foundation of everything else.", "think"),
    I("Protect privacy",
      "<p>What you type into an AI tool may be stored, reviewed, or used to improve the service, depending on the company and your settings. So:</p>" +
      "<div class='grid g2'><div class='callout good'><b>Do</b><ul><li>Ask about topics and concepts</li><li>Use school-approved tools when your school provides them</li><li>Read the privacy settings</li></ul></div>" +
      "<div class='callout warn'><b>Don’t</b><ul><li>Share passwords, addresses or phone numbers</li><li>Paste other people’s private stories or photos</li><li>Upload anything you’d be upset to see public</li></ul></div></div>",
      "Your privacy and other people’s privacy both matter.", "wow"),
    I("Credit and copyright",
      "<p>AI tools learn from existing works and can produce text or images that resemble them. <b>You’re still responsible</b> for giving credit and following copyright rules.</p>" +
      "<ul><li>Using someone’s ideas or words? Cite the original source.</li>" +
      "<li>Check the license before using an image, song or text in a project.</li>" +
      "<li>Cite the AI tool when your teacher or citation style asks. Style guides such as MLA and APA now have formats for it.</li></ul>",
      "Give credit where credit is due!", "happy"),
    R("Fairness, truth and respect", "Tap each card to explore.", [
      { icon: "mask", front: "Deepfakes & fake media", back: "AI can create realistic fake images, audio and video. Don’t make or share fake media that could deceive or hurt someone, and never use a person’s face or voice without their consent." },
      { icon: "alert", front: "Misinformation", back: "AI makes it easy to create convincing false content, and easy to spread it. <b>Check before you share.</b>" },
      { icon: "heart", front: "Bullying & harm", back: "Using AI to harass, impersonate or embarrass someone is still bullying, and it can have serious consequences." },
      { icon: "scale", front: "Fairness", back: "Ask who might be left out or treated unfairly by an AI tool, and speak up when you notice it." }
    ]),
    I("The R.E.A.L. Check",
      "<p>Before you submit or share anything made with AI, run the <b>R.E.A.L. Check</b>:</p>" +
      "<ul><li><b>R: Rules.</b> Am I following my teacher’s and school’s rules, and being honest about my AI use?</li>" +
      "<li><b>E: Effort.</b> Is the thinking still mine? Did I learn something?</li>" +
      "<li><b>A: Accuracy.</b> Have I checked the facts and the sources?</li>" +
      "<li><b>L: Look out.</b> Am I protecting privacy, giving credit and being fair to others?</li></ul>",
      "If it passes the R.E.A.L. Check, you’re in good shape.", "cheer"),
    SORT("Responsible or not?", ["Responsible", "Not responsible"], [
      { x: "Brainstorming topics with AI, writing the paper yourself, and noting you used AI", b: 0, why: "Your thinking, honest disclosure." },
      { x: "Pasting a classmate’s personal story into a chatbot to “fix it” without asking", b: 1, why: "It shares someone’s private information without consent." },
      { x: "Making a fake AI screenshot of a teacher saying something silly and sharing it", b: 1, why: "It’s deceptive and could hurt someone." },
      { x: "Checking an AI-written fact against two reliable sources", b: 0, why: "That’s the 3-Check Rule in action." },
      { x: "Submitting an AI-written essay as your own work", b: 1, why: "It isn’t your work, and it’s dishonest." },
      { x: "Asking your teacher whether AI is allowed on an assignment", b: 0, why: "When in doubt, ask." }
    ])
  ];

  var m4Challenge = [
    I("Scenario: make a responsible choice",
      "<p>Three real-life situations are coming up. Pick the choice you’d be proud of. If you miss one, you’ll get another try at the end.</p>",
      "No pressure. These are practice rounds for real life.", "think"),
    Q("What do you do?",
      [
        { x: "Go along with it. Everyone’s tired.", fb: "The rules say AI is for brainstorming and feedback only, so this would break them." },
        { x: "Use AI for outlining or feedback within the rules, split up the writing, and be upfront about how you used AI.", fb: "You stay within the rules and still use time wisely." },
        { x: "Secretly use AI, but change a few words so no one notices.", fb: "Hiding AI use doesn’t make it okay, and it’s still dishonest." },
        { x: "Refuse to talk and do everything yourself.", fb: "Your integrity is solid, but working with your group on allowed uses is a better move." }
      ], 1, "Work within the rules and be transparent.",
      { situation: "It’s 11 p.m. and your group’s lab report is due at 8 a.m. A teammate says, “Let’s have AI write the whole thing and paste it in.” Your teacher’s rules say AI can be used for brainstorming and feedback only.", tag: "Situation 1" }),
    Q("What’s the best response?",
      [
        { x: "Forward it. It’s just a joke.", fb: "A “joke” can seriously hurt someone, and sharing it spreads the harm." },
        { x: "Don’t forward it, tell your friend it could hurt the classmate, and report it to a trusted adult or the platform if it keeps spreading.", fb: "You stop the spread, protect the classmate and get help." },
        { x: "Reply with a mean joke of your own.", fb: "That adds to the bullying." },
        { x: "Ignore it completely.", fb: "Staying silent leaves the classmate unprotected. Small actions can make a big difference." }
      ], 1, "Don’t share it, speak up, and report if needed.",
      { situation: "A friend sends you an AI-generated image that makes a classmate look ridiculous. It’s spreading in a group chat.", tag: "Situation 2" }),
    Q("What’s the safest choice?",
      [
        { x: "Upload everything. Free is free.", fb: "If it’s free, your data may be the price. Sharing a face photo and phone number is risky." },
        { x: "Skip the personal info, read the privacy policy, and ask your teacher about a school-approved tool.", fb: "You protect your privacy and look for a safer option." },
        { x: "Use a fake name but give your real phone number.", fb: "Your phone number is still personal information." },
        { x: "Tell your friends to sign up so you can unlock a bonus.", fb: "That pushes risk onto other people too." }
      ], 1, "Don’t share personal info with unknown tools. Ask about approved options.",
      { situation: "A free AI homework app asks you to upload a photo of your face and enter your phone number to “personalize” your help.", tag: "Situation 3" })
  ];

  var m4Quiz = [
    SORT("Responsible or not? Sort each action.", ["Responsible", "Not responsible"], [
      { x: "Telling your teacher you used AI to check grammar on your draft", b: 0, why: "Honest and transparent." },
      { x: "Typing your home address into a chatbot so it can “personalize” your essay", b: 1, why: "Personal info doesn’t belong in a prompt." },
      { x: "Using an AI-made image in a project without checking whether you’re allowed to", b: 1, why: "You’re still responsible for rights and credit." },
      { x: "Citing the sources you verified, not just “the chatbot said so”", b: 0, why: "Credit the real sources." },
      { x: "Cloning a friend’s voice with AI to prank others without asking", b: 1, why: "Using someone’s voice without consent can deceive and hurt." },
      { x: "Using AI to practice quiz questions based on your own notes", b: 0, why: "That’s using AI to support your learning." }
    ]),
    Q("What does academic integrity mean when using AI?",
      ["Using AI for everything so you save time", "Doing your own thinking, following the rules, and being honest about how you used AI", "Never touching a computer", "Letting AI do the hard parts"], 1,
      "Integrity = your own thinking, the rules, and honesty.", { shuffle: true }),
    Q("Which is the safest thing to type into an AI chatbot?",
      ["Your phone number", "Your password so it can “help you log in”", "A question about how volcanoes form", "A private photo of a classmate"], 2,
      "General topic questions are fine. Don’t share private info.", { shuffle: true }),
    Q("You’re not sure whether AI is allowed on an assignment. What should you do?",
      ["Use it and hope for the best", "Ask your teacher before using it", "Use it but delete the chat", "Ask a friend to use it for you"], 1,
      "When in doubt, ask first.", { shuffle: true }),
    TF("If no one can tell you used AI, it’s fine to hide it when your class requires you to disclose it.", false,
      "Integrity means being honest even when no one would find out."),
    MATCH("Match each letter of the R.E.A.L. Check to its meaning.", [
      ["R: Rules", "Follow school rules and be honest about AI use"],
      ["E: Effort", "The thinking and learning are still mine"],
      ["A: Accuracy", "Facts and sources have been checked"],
      ["L: Look out", "Protect privacy, give credit, be fair"]
    ])
  ];

  /* =========================================================
     FINAL APPLICATION — everything together
     ========================================================= */
  var finalSteps = [
    I("Final Application: the Research Report Challenge",
      "<div class='situation'><span class='tag'>Your case</span>Your teacher assigns a 3-page report on <b>renewable energy in your state</b>. AI is allowed for brainstorming, studying and feedback, <b>not</b> for writing the report. You must also describe how you used it.</div>" +
      "<p>You’ll use all four levels: understand, assess, apply and act responsibly. Then you’ll write your own <b>AI Use Statement</b>.</p>",
      "This is it! Show everything you’ve learned.", "wave"),
    Q("<b>Level 1 · Understand.</b> Which task is the best fit for AI on this project?",
      ["Writing the full report", "Brainstorming possible angles and subtopics to research", "Making up statistics so the report sounds convincing", "Choosing a conclusion before reading anything"], 1,
      "AI is great as a brainstorming partner. The research and writing should be yours.", { shuffle: true }),
    SPOT("<b>Level 2 · Assess.</b> AI drafted this paragraph for you to <i>review</i>. Tap the sentences with red flags.", [
      { x: "Renewable energy includes sources like solar, wind and hydropower.", wrong: false },
      { x: "According to a 2022 study by Dr. Helen Park, exactly 87.4% of all households in every state now use solar panels.", wrong: true, fix: "Unverifiable citation and an unrealistic statistic. Search for the study before using it." },
      { x: "Wind turbines turn the energy of moving air into electricity.", wrong: false },
      { x: "Solar panels only work when it is hot, so they can’t work in cold climates.", wrong: true, fix: "Solar panels need sunlight, not heat. They can work in cold weather." },
      { x: "Renewable sources generally produce fewer greenhouse gas emissions than burning coal.", wrong: false }
    ], "AI-generated draft paragraph"),
    BUILD("<b>Level 3 · Apply.</b> Build a prompt to brainstorm angles for your report.", "You want 6 angles you could research for your renewable energy report.", [
      { label: "Role", options: [
        { x: "Act as a helpful research coach for a high school student.", good: true, why: "Sets the right helper and level." },
        { x: "Act as a famous scientist.", why: "Pretending to be someone famous doesn’t make answers more reliable." },
        { x: "Be a robot.", why: "That doesn’t tell the AI anything useful." }
      ] },
      { label: "Task", options: [
        { x: "Suggest 6 possible angles for my report, each with one question I could research.", good: true, why: "Brainstorming plus research questions keeps the work yours." },
        { x: "Write my 3-page report.", why: "The assignment doesn’t allow AI to write the report." },
        { x: "Give me statistics I can put in my report.", why: "You need to find statistics from real sources yourself." }
      ] },
      { label: "Context", options: [
        { x: "It’s a 3-page report on renewable energy in my state for a 10th grade class, and AI can only be used for brainstorming.", good: true, why: "Includes the topic, level and the rules." },
        { x: "I have homework.", why: "Too vague to help." },
        { x: "Just do your best.", why: "That isn’t context." }
      ] },
      { label: "Format", options: [
        { x: "Use a numbered list with a one-sentence description for each angle.", good: true, why: "Clear and easy to scan." },
        { x: "Write a huge essay.", why: "You asked for brainstorming, not an essay." },
        { x: "Any format.", why: "Give a format so the output is useful." }
      ] }
    ]),
    Q("<b>Level 4 · Act responsibly.</b> You’re short on time and tempted to have AI write your conclusion. What’s the best choice?",
      [
        { x: "Have AI write it and tell no one.", fb: "That breaks the rules and isn’t honest." },
        { x: "Write the conclusion yourself, ask AI for feedback on it, and mention that in your AI Use Statement.", fb: "Your thinking, allowed use, honest disclosure." },
        { x: "Have AI write it, then change a few words.", fb: "It’s still AI’s writing, and the rules don’t allow it." },
        { x: "Copy a conclusion from a website.", fb: "That’s plagiarism, which is another integrity problem." }
      ], 1, "Do your own writing, use AI only as the rules allow, and be transparent."),
    { t: "reflect", key: "finalStatement", title: "Write your AI Use Statement",
      intro: "In 2–4 sentences, describe how you would use AI on this project: <b>what</b> you’d use it for, <b>how you’d check</b> its work, and what <b>you</b> would do yourself.",
      placeholder: "Example: I used AI to brainstorm angles for my report. I checked every fact against two reliable sources, and I wrote all of the report myself…", minChars: 60 }
  ];

  /* =========================================================
     ACTIVITY REGISTRY
     ========================================================= */
  var ACTS = {};
  function act(id, type, mod, kind, title, steps) {
    ACTS[id] = { id: id, type: type, mod: mod, kind: kind, title: title, xp: XP[type], steps: steps };
  }
  act("m1-lesson", "lesson", 1, "Interactive Lesson", "AI Basics", m1Lesson);
  act("m1-challenge", "challenge", 1, "Exploration Activity", "Find AI in Everyday Life", m1Challenge);
  act("m1-quiz", "quiz", 1, "Knowledge Check", "AI Basics", m1Quiz);
  act("m2-lesson", "lesson", 2, "Interactive Lesson", "AI Errors and Bias", m2Lesson);
  act("m2-challenge", "challenge", 2, "Scenario", "Handle Incorrect AI Information", m2Challenge);
  act("m2-quiz", "quiz", 2, "Knowledge Check", "Spot the Error", m2Quiz);
  act("m3-lesson", "lesson", 3, "Interactive Lesson", "Using AI", m3Lesson);
  act("m3-challenge", "challenge", 3, "Prompt Challenge", "Improve a Prompt", m3Challenge);
  act("m3-quiz", "quiz", 3, "Knowledge Check", "Choose the Best Prompt", m3Quiz);
  act("m4-lesson", "lesson", 4, "Interactive Lesson", "Responsible AI", m4Lesson);
  act("m4-challenge", "challenge", 4, "Scenario", "Make a Responsible Choice", m4Challenge);
  act("m4-quiz", "quiz", 4, "Knowledge Check", "Responsible or Not?", m4Quiz);
  ACTS["final"] = { id: "final", type: "final", mod: 5, kind: "Final Application", title: "The Research Report Challenge", xp: XP.final, steps: finalSteps };

  /* ---------- Modules (the four levels) ---------- */
  var MODULES = [
    { n: 1, name: "AI Foundations", sub: "Understanding what AI is", level: "Level 1", levelName: "Introduction to AI", badge: "explorer",
      acts: ["m1-lesson", "m1-challenge", "m1-quiz"], daily: false,
      concepts: ["AI systems and common uses of AI", "Machine learning and data", "Generative AI and how chatbots work", "Narrow AI vs. science fiction"],
      big: "Learning · Perception · Natural interaction", unesco: "AI techniques & applications (Understand)" },
    { n: 2, name: "Understanding AI", sub: "Recognizing AI’s limits", level: "Level 2", levelName: "Assessing AI", badge: "detective",
      acts: ["m2-lesson", "m2-challenge", "m2-quiz"], daily: true,
      concepts: ["AI mistakes and hallucinations", "Bias and where it comes from", "Fact-checking with the 3-Check Rule", "Human judgment stays in charge"],
      big: "Societal impact · Learning (data and bias)", unesco: "A human-centred mindset · Ethics of AI (Understand)" },
    { n: 3, name: "Applying AI", sub: "Learning how to use AI", level: "Level 3", levelName: "Applying AI", badge: "promptpro",
      acts: ["m3-lesson", "m3-challenge", "m3-quiz"], daily: true,
      concepts: ["A tour of AI tools students use", "Writing prompts with Role, Task, Context, Format", "Improving responses by iterating", "Using AI appropriately for school"],
      big: "Natural interaction · Learning", unesco: "AI techniques & applications (Apply)" },
    { n: 4, name: "Responsible AI", sub: "Making responsible choices", level: "Level 4", levelName: "Responsible AI", badge: "guardian",
      acts: ["m4-lesson", "m4-challenge", "m4-quiz"], daily: true,
      concepts: ["Academic integrity and honesty", "Privacy and data", "Copyright and credit", "Deepfakes, misinformation and fairness"],
      big: "Societal impact", unesco: "Ethics of AI · A human-centred mindset (Apply)" }
  ];
  MODULES.forEach(function (m) {
    m.maxXp = m.acts.reduce(function (t, id) { return t + ACTS[id].xp; }, 0) + XP.module;
  });

  /* =========================================================
     DAILY CHALLENGES — one per day, topic rotates
     ========================================================= */
  var DAILY = {
    1: {
      title: "Spot the AI",
      items: [
        Q("Which of these is most likely powered by machine learning?",
          ["A flashlight", "A photo app that groups pictures by the people in them", "A paper calendar", "A wall clock"], 1,
          "Grouping faces means recognizing patterns in images, which is machine learning.", { shuffle: true }),
        Q("What does a machine learning model learn from?",
          ["Data and examples", "Magic", "Only rules typed in one by one", "Feelings"], 0,
          "ML models find patterns in data and examples.", { shuffle: true }),
        TF("Today’s AI systems have feelings and understand the world like humans do.", false,
          "Today’s AI is narrow. It can be impressive at specific tasks but doesn’t have human-style understanding."),
        Q("Generative AI is best described as…",
          ["AI that creates new content from patterns it learned", "AI that only sorts email", "AI that deletes files", "A search engine with no data"], 0,
          "Generative AI makes new text, images, audio or code.", { shuffle: true })
      ]
    },
    2: {
      title: "Fact Check AI",
      items: [
        Q("A chatbot says: “The Great Wall of China is visible from space with the naked eye.” What’s your best move?",
          ["Repeat it. It’s a famous fact.", "Check a reliable source, such as a space agency, before repeating it", "Ask the chatbot to say it again, louder", "Ignore it forever"], 1,
          "This is a popular myth. Checking a reliable source is the right habit.", { shuffle: true }),
        Q("An AI gives you a quote from a famous scientist. What’s the best check?",
          ["Search for the quote in a reliable source such as a book, archive or reputable site", "Trust it because it sounds wise", "Add it to your essay right away", "Ask the AI if it’s sure"], 0,
          "Many quotes are misattributed. Verify with a trustworthy source.", { shuffle: true }),
        Q("An AI says, “73% of teens do X,” with no source. What’s the best step?",
          ["Use it. Percentages sound scientific.", "Ask for the source, open it, and verify. If you can’t find it, don’t use the number", "Round it up", "Post it online"], 1,
          "Statistics need a traceable source.", { shuffle: true }),
        Q("Which is the strongest sign an AI-cited source might be fake?",
          ["You can’t find the article or author anywhere with a quick search", "It has a long title", "It has a year in it", "It sounds interesting"], 0,
          "If a quick search finds nothing, treat the source as unreliable.", { shuffle: true })
      ]
    },
    3: {
      title: "Use AI effectively for a school task",
      items: [
        Q("You’re stuck on a math problem. Which prompt helps you <i>learn</i>?",
          ["Solve this for me.", "Show me just the first step and ask me what comes next.", "Give me the final answer only.", "Do all my homework."], 1,
          "Step-by-step guidance builds your skills.", { style: "prompt", shuffle: true }),
        Q("You need science fair ideas. Which prompt is best?",
          ["Science ideas.", "Give me 8 beginner-friendly science fair ideas using household materials, each with a testable question.", "Tell me everything about science.", "Do my science fair project."], 1,
          "It includes the number, level, constraints and format.", { style: "prompt", shuffle: true }),
        Q("You wrote a paragraph. What’s the best way to use AI?",
          ["Ask it to rewrite your paragraph completely", "Ask for specific feedback on clarity and evidence without rewriting it", "Ask it to write a new paragraph and swap it in", "Skip your own draft"], 1,
          "Feedback keeps the writing and thinking yours.", { shuffle: true }),
        Q("Your notes are messy before a test. Best use of AI?",
          ["Paste your own notes (no personal info), ask for a practice quiz, then check answers against your notes", "Ask it to guess what’s on the test", "Use it during the test", "Have it write your notes from nothing"], 0,
          "Practice quizzes from your notes help you study, and checking answers keeps the AI honest.", { shuffle: true })
      ]
    },
    4: {
      title: "Use AI responsibly",
      items: [
        Q("Your teacher allows AI for brainstorming only. You used it to brainstorm. What next?",
          ["Say nothing ever", "Note that you used AI for brainstorming if disclosure is required", "Pretend you didn’t use it", "Delete the chat and hope"], 1,
          "Be transparent about allowed AI use.", { shuffle: true }),
        Q("What should you keep out of a chatbot?",
          ["The topic of your essay", "Your passwords and your home address", "A general science question", "A math concept you’re studying"], 1,
          "Never share private info.", { shuffle: true }),
        Q("A classmate asks you to make an AI voice clip of a teacher saying silly things. Best response?",
          ["Sure, it’s funny", "Say no. It could mislead or hurt, and it uses someone’s voice without consent", "Make it but don’t share it", "Make it and share only with friends"], 1,
          "Don’t create deceptive fake media of real people.", { shuffle: true }),
        Q("In the R.E.A.L. Check, what does the “A” remind you to do?",
          ["Ask for extra credit", "Check the accuracy of facts and sources", "Add more pictures", "Answer quickly"], 1,
          "A = Accuracy: verify before you submit or share.", { shuffle: true })
      ]
    }
  };

  /* =========================================================
     PRACTICE POOLS: extra questions per module (practice quizzes)
     ========================================================= */
  var PRACTICE_EXTRA = {
    1: [
      Q("Which is an example of <b>narrow AI</b>?", ["A chess program that can’t do anything else", "A robot that thinks like a person", "A machine that can do any job", "A computer with feelings"], 0, "Narrow AI is good at one specific job.", { shuffle: true }),
      Q("A company wants a spam filter that improves over time. What does it need most?", ["Lots of labeled examples of spam and not-spam", "A bigger monitor", "Fewer emails", "A human to read every message"], 0, "Machine learning needs many examples to learn patterns.", { shuffle: true }),
      Q("Which sentence best describes generative AI?", ["It creates new content like text or images", "It only sorts photos", "It repairs computers", "It stores passwords"], 0, "Generative AI creates new content from learned patterns.", { shuffle: true })
    ],
    2: [
      Q("Why might an AI chatbot give outdated information?", ["Its training data stops at a certain point in time", "It dislikes news", "It can’t read", "It is always wrong"], 0, "Models are trained on data up to a certain time.", { shuffle: true }),
      Q("Which is the best definition of AI bias?", ["Results that are unfairly skewed toward or against certain people or ideas", "When AI is slow", "When AI uses too much battery", "When AI agrees with you"], 0, "Bias means systematically unfair or skewed results.", { shuffle: true }),
      Q("What’s a quick test of whether a cited source is real?", ["Search for the title and author", "Check if it has a long title", "Count the words", "Ask the AI to repeat it"], 0, "A quick search often reveals fake sources.", { shuffle: true })
    ],
    3: [
      Q("Which part of the R-T-C-F recipe tells the AI how long and how structured the answer should be?", ["Role", "Task", "Context", "Format"], 3, "Format covers structure like lists, tables and length.", {}),
      Q("Which prompt asks for learning rather than just answers?", ["“Just give me the answer.”", "“Quiz me one question at a time and wait for my reply.”", "“Do it all.”", "“Skip the explanation.”"], 1, "Interactive practice helps you learn.", { style: "prompt", shuffle: true }),
      Q("You get a weak first answer. What’s a smart move?", ["Give up on AI forever", "Refine your prompt with a specific follow-up", "Copy it anyway", "Ask the same thing again with no changes"], 1, "Iterating with clearer instructions improves results.", { shuffle: true })
    ],
    4: [
      Q("What’s a good habit when an assignment’s AI rules aren’t clear?", ["Ask your teacher", "Guess", "Use AI secretly", "Ask a stranger online"], 0, "When in doubt, ask.", { shuffle: true }),
      Q("Where might text you type into an AI service end up?", ["It may be stored or reviewed, depending on the service and settings", "It vanishes instantly, always", "It is only seen by you, always", "It is posted on a billboard"], 0, "Services differ, so treat prompts as not fully private.", { shuffle: true }),
      Q("Who is responsible for the accuracy of AI-generated content you submit?", ["You are", "Only the AI company", "Nobody", "Your friend"], 0, "You are responsible for what you submit.", { shuffle: true })
    ]
  };

  /* =========================================================
     GAMES (practice only: no XP, but they track high scores)
     ========================================================= */
  var GAMES = [
    { id: "game-aiornot", title: "AI or Not?", desc: "Race the clock! Is each everyday item powered by AI?", icon: "bolt", color: "b", mod: 1,
      seconds: 45, buckets: ["AI", "Not AI"],
      items: [
        { x: "Face unlock on a phone", b: 0, why: "Recognizes patterns in faces." },
        { x: "A digital clock", b: 1, why: "Fixed rules, no learning." },
        { x: "Voice assistant understanding speech", b: 0, why: "Speech recognition is machine learning." },
        { x: "A basic calculator", b: 1, why: "Fixed math rules." },
        { x: "Streaming “recommended for you”", b: 0, why: "Predicts from patterns in data." },
        { x: "A light switch", b: 1, why: "Simple on/off." },
        { x: "Email spam filter that learns from reports", b: 0, why: "Learns patterns of spam." },
        { x: "A microwave timer", b: 1, why: "A simple timer." },
        { x: "Photo app grouping pictures by person", b: 0, why: "Face recognition." },
        { x: "A TV remote", b: 1, why: "Sends fixed signals." },
        { x: "A chatbot writing a short story", b: 0, why: "Generative AI." },
        { x: "A spreadsheet’s SUM formula", b: 1, why: "A fixed formula." },
        { x: "Traffic predictions in a map app", b: 0, why: "Predicts from lots of data." },
        { x: "A pencil sharpener", b: 1, why: "A mechanical tool." },
        { x: "Live captions on a video call", b: 0, why: "Speech-to-text AI." },
        { x: "A printed book", b: 1, why: "Static text, no AI." },
        { x: "Card fraud alerts that flag unusual purchases", b: 0, why: "ML spots unusual patterns." },
        { x: "A thermostat you set by hand", b: 1, why: "It just follows your setting." },
        { x: "Translating a sign with your phone camera", b: 0, why: "Vision and language AI." },
        { x: "A flashlight", b: 1, why: "Simple electric device." }
      ] },
    { id: "game-factfib", title: "Fact or Fib?", desc: "Would you trust it? Spot claims an AI might get wrong.", icon: "search", color: "m", mod: 2,
      seconds: 45, buckets: ["Accurate", "Needs fixing"],
      items: [
        { x: "Water boils at 100°C at sea level.", b: 0, why: "True at standard pressure." },
        { x: "Humans only use 10% of their brains.", b: 1, why: "A myth. We use all of our brain." },
        { x: "Jupiter is the largest planet in our solar system.", b: 0, why: "True." },
        { x: "Lightning never strikes the same place twice.", b: 1, why: "It often does, like tall buildings." },
        { x: "Photosynthesis happens in chloroplasts.", b: 0, why: "True." },
        { x: "Earth has seasons because it is closer to the Sun in summer.", b: 1, why: "Seasons come from Earth’s tilt, not its distance from the Sun." },
        { x: "The Pacific is the largest ocean.", b: 0, why: "True." },
        { x: "Spiders are insects.", b: 1, why: "They’re arachnids, with eight legs." },
        { x: "The Sun is a star.", b: 0, why: "True." },
        { x: "The Sahara is the largest desert in the world.", b: 1, why: "Antarctica is larger. The Sahara is the largest hot desert." },
        { x: "DNA carries genetic information.", b: 0, why: "True." },
        { x: "The heart pumps blood through the body.", b: 0, why: "True." },
        { x: "The Great Wall of China is visible from space with the naked eye.", b: 1, why: "A popular myth." }
      ] },
    { id: "game-responsible", title: "Responsible or Not?", desc: "Quick decisions: which choices show good AI citizenship?", icon: "shield", color: "o", mod: 4,
      seconds: 45, buckets: ["Responsible", "Not responsible"],
      items: [
        { x: "Asking your teacher if AI is allowed", b: 0, why: "When in doubt, ask." },
        { x: "Submitting AI writing as your own", b: 1, why: "Dishonest." },
        { x: "Checking AI facts with two sources", b: 0, why: "3-Check Rule." },
        { x: "Typing a classmate’s private story into a chatbot", b: 1, why: "Violates their privacy." },
        { x: "Telling your teacher how you used AI", b: 0, why: "Honest." },
        { x: "Making a fake AI video of a teacher", b: 1, why: "Deceptive and harmful." },
        { x: "Using a school-approved AI tool", b: 0, why: "Safer for privacy." },
        { x: "Sharing a rumor an AI wrote without checking", b: 1, why: "Spreads misinformation." },
        { x: "Keeping passwords out of chats", b: 0, why: "Protects your accounts." },
        { x: "Using AI on a test when it’s banned", b: 1, why: "Breaks the rules." },
        { x: "Citing the sources for ideas you borrowed", b: 0, why: "Gives credit." },
        { x: "Putting someone’s face in AI images without asking", b: 1, why: "Needs consent." },
        { x: "Asking AI to quiz you on your own notes", b: 0, why: "Supports learning." },
        { x: "Copying AI sources into a bibliography without checking them", b: 1, why: "They might not exist." }
      ] },
    { id: "game-prompt", title: "Prompt Fixer", desc: "Five weak prompts. Pick the upgrade that works best.", icon: "spark", color: "p", mod: 3, prompts: true }
  ];

  var PROMPT_GAME = [
    Q("Pick the best upgrade.", [
      "Summarize this.", "Summarize the article below in 4 bullet points for a 9th grader, then list 2 claims I should still verify.", "Make it short.", "Do it better."], 1, "Audience, format and a verification step make it useful.", { style: "prompt", say: "Summarize this.", shuffle: true }),
    Q("Pick the best upgrade.", [
      "Give me ideas.", "Give me 8 topic ideas for a 2-page civics essay about local government, each with a one-sentence angle.", "Ideas please!!", "Write the essay."], 1, "A clear task, subject and format.", { style: "prompt", say: "Give me ideas.", shuffle: true }),
    Q("Pick the best upgrade.", [
      "Help with my code.", "Here’s my Python function and the error message. Explain what the error means and suggest a fix, but don’t rewrite my entire program.", "Fix everything.", "Code broken."], 1, "Gives context and keeps you learning.", { style: "prompt", say: "Help with my code.", shuffle: true }),
    Q("Pick the best upgrade.", [
      "Teach me history.", "Explain the causes of World War I in 5 short points for a 10th grader, then quiz me with 3 questions.", "History facts.", "Tell me everything about wars."], 1, "Defines scope, level and practice.", { style: "prompt", say: "Teach me history.", shuffle: true }),
    Q("Pick the best upgrade.", [
      "Translate this.", "Translate this into Spanish for a school pen-pal letter. Keep it friendly and simple, and explain any idioms you changed.", "Spanish it.", "Make it Spanish and perfect."], 1, "Purpose, tone and an explanation make it better.", { style: "prompt", say: "Translate this.", shuffle: true })
  ];

  return {
    XP: XP, BADGES: BADGES, MODULES: MODULES, ACTS: ACTS, DAILY: DAILY,
    PRACTICE_EXTRA: PRACTICE_EXTRA, GAMES: GAMES, PROMPT_GAME: PROMPT_GAME
  };
})();
