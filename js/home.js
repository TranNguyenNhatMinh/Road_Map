(function () {
  const QUOTES = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
    { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
    { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "The best investment you can make is in your own abilities.", author: "Warren Buffett" },
    { text: "When something is important enough, you do it even if the odds are not in your favor.", author: "Elon Musk" },
    { text: "I think it's possible for ordinary people to choose to be extraordinary.", author: "Elon Musk" },
    { text: "We all need people who will give us feedback. That's how we improve.", author: "Bill Gates" },
    { text: "Success is a lousy teacher. It seduces smart people into thinking they can't lose.", author: "Bill Gates" },
    { text: "If you're not stubborn, you'll give up on experiments too soon. And if you're not flexible, you'll pound your head against the wall.", author: "Jeff Bezos" },
    { text: "The biggest risk is not taking any risk.", author: "Mark Zuckerberg" },
    { text: "The biggest adventure you can take is to live the life of your dreams.", author: "Oprah Winfrey" },
    { text: "If someone offers you an amazing opportunity and you're not sure you can do it, say yes – then learn how to do it later.", author: "Richard Branson" },
    { text: "Today is hard, tomorrow will be worse, but the day after tomorrow will be sunshine.", author: "Jack Ma" },
    { text: "Always deliver more than expected.", author: "Larry Page" },
    { text: "It takes 20 years to build a reputation and five minutes to ruin it. Think about that and you'll do things differently.", author: "Warren Buffett" },
    { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" }
  ];

  var i = Math.floor(Math.random() * QUOTES.length);
  var q = QUOTES[i];
  var textEl = document.getElementById("motivationText");
  var authorEl = document.getElementById("motivationAuthor");
  if (textEl) textEl.textContent = q.text;
  if (authorEl) authorEl.textContent = "— " + q.author;

})();
