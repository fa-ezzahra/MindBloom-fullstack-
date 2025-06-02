import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function AboutPage() {
  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Clinical Psychologist",
      bio: "Dr. Johnson specializes in CBT and has over 15 years of experience treating anxiety and depression.",
    },
    {
      name: "Michael Chen",
      role: "Technology Director",
      bio: "Michael leads our tech team, ensuring our platform is accessible, secure, and user-friendly.",
    },
    {
      name: "Dr. James Wilson",
      role: "Research Lead",
      bio: "Dr. Wilson oversees our research initiatives to ensure all our methods are evidence-based and effective.",
    },
    {
      name: "Aisha Patel",
      role: "User Experience Designer",
      bio: "Aisha designs intuitive interfaces that make mental health support accessible to everyone.",
    },
  ]

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About MindBloom</h1>

        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            MindBloom was founded with a simple mission: to make mental health support accessible to everyone, anywhere,
            anytime. We believe that everyone deserves access to high-quality mental health resources, regardless of
            their location or circumstances.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p className="mb-6">
            Our mission is to leverage technology to provide evidence-based mental health support to individuals
            suffering from depression and anxiety. We aim to break down barriers to mental health care and empower
            individuals to take control of their mental wellness journey.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Approach</h2>
          <p className="mb-4">
            MindBloom's approach is grounded in Cognitive Behavioral Therapy (CBT), a well-researched and effective
            treatment for depression and anxiety. Our platform offers various tools and resources based on CBT
            principles:
          </p>

          <div className="grid gap-3 my-6">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <p>
                <strong>Evidence-based techniques:</strong> All our tools and resources are based on proven CBT methods.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <p>
                <strong>Personalized support:</strong> Our AI-powered chatbot adapts to your unique needs and
                circumstances.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <p>
                <strong>Holistic approach:</strong> We address various aspects of mental wellness through our diverse
                services.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <p>
                <strong>Privacy-focused:</strong> Your mental health data is private and secure.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Team</h2>
          <p className="mb-6">
            MindBloom is powered by a dedicated team of mental health professionals, technologists, and designers
            committed to making mental health support accessible and effective.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {team.map((member, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-primary text-sm mb-2">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-muted/50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
          <p className="mb-4">At MindBloom, we are committed to:</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <span>Providing evidence-based mental health support</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <span>Ensuring privacy and security of user data</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <span>Continuously improving our platform based on user feedback and research</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <span>Making mental health support accessible to everyone</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
