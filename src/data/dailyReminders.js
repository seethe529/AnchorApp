export const dailyReminders = [
  "You are stronger than you think, and braver than you feel.",
  "Healing isn't linear - every small step forward counts.",
  "Your feelings are valid, and it's okay to not be okay today.",
  "You've survived 100% of your difficult days so far.",
  "Progress, not perfection. You're doing better than you realize.",
  "It's okay to rest. Recovery requires both action and patience.",
  "You are not broken - you are healing and growing.",
  "Every breath you take is an act of courage and resilience.",
  "Your story isn't over yet. There are still beautiful chapters to write.",
  "You don't have to be grateful for trauma, but you can be proud of your strength.",
  "Some days surviving is enough. That's still a victory.",
  "Your nervous system is trying to protect you - thank it and reassure it you're safe.",
  "Flashbacks are memories, not current reality. You are safe now.",
  "It's okay to feel angry about what happened to you.",
  "You deserve compassion, especially from yourself.",
  "Asking for help is a sign of strength, not weakness.",
  "Your hypervigilance kept you safe then - you can learn to relax now.",
  "Nightmares can't hurt you. You wake up safe every time.",
  "You are not responsible for what happened to you.",
  "Your body remembers trauma, but it also remembers how to heal.",
  "It's okay to have bad days. They don't erase your progress.",
  "You are allowed to set boundaries to protect your peace.",
  "Your triggers are information, not instructions.",
  "You've already proven you can survive the unthinkable.",
  "Healing happens in waves - ride them with self-compassion.",
  "You are not your trauma. You are so much more.",
  "Every day you choose to keep going is an act of rebellion against trauma.",
  "Your sensitivity is not a weakness - it's a superpower that needs protection.",
  "You don't owe anyone your trauma story or your healing timeline.",
  "It's okay to grieve the person you were before trauma changed you.",
  "Your fight-or-flight response saved your life - now you can teach it to rest.",
  "You are allowed to feel joy, even after experiencing trauma.",
  "Recovery isn't about forgetting - it's about integrating and moving forward.",
  "Your hypervigilance scanned for danger to keep you safe - you can retrain it.",
  "You survived because you are a survivor, not a victim.",
  "It's okay to need more support some days than others.",
  "Your trauma responses made sense then and your healing makes sense now.",
  "You don't have to earn your worth - you were born worthy.",
  "Some days, just showing up is enough. You showed up today.",
  "Your nervous system is learning it's safe to relax with you.",
  "You are not too much, too sensitive, or too broken to be loved.",
  "Every small act of self-care is an act of revolution against trauma.",
  "You get to decide what healing looks like for you.",
  "Your body kept the score, but you get to write the next chapter.",
  "It's okay to take up space and have needs.",
  "You are not responsible for managing other people's comfort with your trauma.",
  "Your inner child deserves the protection and love you're learning to give.",
  "Trauma tried to teach you that you weren't safe - you're learning that you are.",
  "You don't have to be productive to be valuable.",
  "Your healing journey is unique - don't compare it to anyone else's."
];

export const getRandomReminder = () => {
  const randomIndex = Math.floor(Math.random() * dailyReminders.length);
  return dailyReminders[randomIndex];
};

export const getDailyReminder = () => {
  // Use date as seed for consistent daily reminder, but still random
  const today = new Date().toDateString();
  const seed = today.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const index = Math.abs(seed) % dailyReminders.length;
  return dailyReminders[index];
};