// Helper to generate a date for "yesterday at 16:24"
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
yesterday.setHours(16, 24, 0, 0);

// Mock data for the question
export const mockQuestion = {
  id: "1",
  title: "I'm facing problems on Github",
  content: `Good afternoon, alright?

Here on mine I had several errors during the build and until then I made the corrections and it ran again, but now I made the last correction and it no longer runs. How do I make it run?

![Screenshot of GitHub errors](/placeholder.png?height=300&width=600&query=github%20errors%20screenshot)`,
  authorAddress: "0x123456789abcdef",
  authorName: "Jhane Doe",
  timestamp: "yesterday at 16:24",
  stakeAmount: "2500.00",
  tags: ["github", "build", "errors"],
  repositoryUrl: "https://github.com/user/repo",
  isOpen: true,
}