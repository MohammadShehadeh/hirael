const NEXACORE_CSS = `
.nexacore {
  --background: #ffffff;
  --foreground: rgb(26, 11, 84);
  --card: #ffffff;
  --card-foreground: rgb(26, 11, 84);
  --popover: #ffffff;
  --popover-foreground: rgb(26, 11, 84);
  --primary: rgb(28, 78, 255);
  --primary-foreground: #ffffff;
  --secondary: rgb(249, 249, 249);
  --secondary-foreground: rgb(26, 11, 84);
  --muted: rgb(249, 249, 249);
  --muted-foreground: rgb(169, 151, 206);
  --accent: rgb(249, 249, 249);
  --accent-foreground: rgb(26, 11, 84);
  --border: rgb(232, 228, 243);
  --input: rgb(232, 228, 243);
  --ring: rgb(28, 78, 255);
  --nexa-navy: rgb(26, 11, 84);
  --nexa-lavender: rgb(169, 151, 206);
  --nexa-lavender-2: rgb(189, 174, 231);
  --nexa-lavender-3: rgb(131, 121, 158);
  --nexa-accent: rgb(200, 111, 255);
  --nexa-blue: rgb(28, 78, 255);
  --nexa-chip: rgb(249, 249, 249);
  --nexa-card-dark: rgba(10, 5, 20, 0.88);
  --nexa-badge: rgb(41, 31, 57);
  --nexa-grad-a: linear-gradient(90deg, rgb(28, 78, 255), rgb(172, 36, 255) 50%, rgb(254, 136, 27));
  --nexa-grad-b: linear-gradient(90deg, rgb(43, 167, 255), rgb(202, 69, 255) 50%, rgb(254, 136, 27));
  --nexa-grad-line: linear-gradient(rgb(28, 78, 255), rgb(254, 136, 27) 0%, rgb(172, 36, 255) 25%, rgb(247, 159, 255) 50%, rgb(255, 214, 0) 66%, rgb(254, 136, 27) 84%, rgba(254, 136, 27, 0) 102%);
}
.nexacore .nexa-grad-text {
  background-image: var(--nexa-grad-b);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}
.nexacore .nexa-grad-a-bg {
  background-image: var(--nexa-grad-a);
}
.nexacore .nexa-grad-line-bg {
  background-image: var(--nexa-grad-line);
}
.nexacore .nexa-soft-shadow {
  box-shadow: 0 3px 9.1px rgba(63, 74, 126, 0.05), 0 1px 29px rgba(63, 74, 126, 0.1);
}
.nexacore .nexa-blur-card {
  backdrop-filter: blur(36px);
  -webkit-backdrop-filter: blur(36px);
}
`;

export const NexacoreStyles = () => {
  return <style dangerouslySetInnerHTML={{ __html: NEXACORE_CSS }} />;
};
