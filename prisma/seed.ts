import { PrismaClient, UserRole } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting seeding...")

  // Create admin user
  const adminPassword = await hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@amapiano.fm" },
    update: {},
    create: {
      email: "admin@amapiano.fm",
      name: "Admin User",
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  })
  console.log(`Created admin user: ${admin.email}`)

  // Create categories
  const categories = [
    { name: "Interviews", slug: "interviews", description: "Exclusive interviews with Amapiano artists" },
    { name: "Features", slug: "features", description: "In-depth features about Amapiano music and culture" },
    { name: "News", slug: "news", description: "Latest news from the Amapiano scene" },
    { name: "Tutorials", slug: "tutorials", description: "Learn how to create Amapiano music" },
    { name: "Reviews", slug: "reviews", description: "Reviews of the latest Amapiano releases" },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }
  console.log(`Created ${categories.length} categories`)

  // Create tags
  const tags = [
    "Amapiano",
    "South Africa",
    "DJ Maphorisa",
    "Kabza De Small",
    "Log Drum",
    "Piano",
    "Johannesburg",
    "Dance",
    "Culture",
    "Music Production",
    "Samples",
    "Tutorial",
    "Festival",
    "Vinyl",
    "Streaming",
    "Charts",
  ]

  for (const tagName of tags) {
    await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName },
    })
  }
  console.log(`Created ${tags.length} tags`)

  // Create sample articles
  const interviewCategory = await prisma.category.findUnique({
    where: { slug: "interviews" },
  })

  const featureCategory = await prisma.category.findUnique({
    where: { slug: "features" },
  })

  const articles = [
    {
      title: "The Rise of Amapiano: How South Africa's Sound Conquered the World",
      slug: "the-rise-of-amapiano",
      excerpt:
        "We sit down with the pioneers of the Amapiano movement to discuss how this uniquely South African sound has captured global attention and what's next for the genre.",
      content: `
# The Rise of Amapiano: How South Africa's Sound Conquered the World

Amapiano, the genre that emerged from the townships of South Africa, has rapidly evolved from a local phenomenon to a global music movement. In this exclusive interview, we sit down with the pioneers who helped shape the sound and bring it to international audiences.

## Origins in the Township

"It started as something we did for fun," explains DJ Maphorisa, one of the genre's most influential figures. "We were experimenting with house music, kwaito, and jazz elements. The log drum became the signature sound that everyone recognized."

The genre's name itself—Amapiano, meaning "the pianos" in Zulu—references the prominent piano melodies that float above the distinctive bass lines and log drums.

## Breaking Boundaries

What began in the townships of Pretoria and Johannesburg around 2012 has now reached clubs and festivals across Europe, America, and Asia. The COVID-19 pandemic, surprisingly, accelerated this global spread.

"During lockdown, everyone was on social media, sharing dance challenges to Amapiano tracks," says Kabza De Small. "TikTok and Instagram really helped push the sound internationally when people couldn't experience it in clubs."

## The Future of the Sound

As Amapiano continues to evolve, artists are exploring new fusions and collaborations. "We're seeing Amapiano mixed with Afrobeats, UK garage, even reggaeton," notes DBN Gogo. "But we always keep that South African soul at the center."

The pioneers are also focused on ensuring that the genre's origins are respected as it grows globally. "It's important that people know this comes from South Africa, from our townships," emphasizes DJ Maphorisa. "We want the world to enjoy it, but also to respect where it comes from and the culture behind it."

With dedicated radio stations, international festival stages, and major label interest, Amapiano has secured its place in the global music landscape—a testament to South Africa's rich musical innovation and cultural influence.
      `,
      published: true,
      publishedAt: new Date("2023-06-15"),
      authorId: admin.id,
      categoryId: interviewCategory?.id,
    },
    {
      title: "Top 10 Amapiano Tracks of 2023 So Far",
      slug: "top-10-amapiano-tracks-2023",
      excerpt:
        "We count down the most impactful Amapiano releases that have defined the sound in 2023, from chart-toppers to underground gems.",
      content: `
# Top 10 Amapiano Tracks of 2023 So Far

As we reach the midpoint of 2023, the Amapiano scene continues to evolve and produce incredible music. Here's our countdown of the ten most impactful tracks that have defined the sound this year.

## 10. "Mnike" - Tyler ICU & Tumelo.za feat. DJ Maphorisa, Nandipha808, Ceeka RSA & Tyron Dee

Starting our list is the infectious "Mnike," which has become a global dance floor favorite with its irresistible rhythm and catchy vocal hooks.

## 9. "Imithandazo" - Kabza De Small & DJ Maphorisa feat. Nomcebo Zikode

A spiritual offering that showcases the more soulful side of Amapiano, with Nomcebo's powerful vocals adding emotional depth to the production.

## 8. "Asibe Happy" - Kabza De Small & DJ Maphorisa feat. Ami Faku

This uplifting track has become an anthem of positivity, with Ami Faku's distinctive voice perfectly complementing the bright piano melodies.

## 7. "Unavailable" - Davido feat. Musa Keys

A perfect example of the Afrobeats-Amapiano fusion that's taking over global airwaves, with Nigerian superstar Davido embracing the South African sound.

## 6. "Bambelela" - Tyler ICU feat. Dali Wonga

With its hypnotic log drum pattern and soulful vocals, "Bambelela" has been dominating both radio playlists and club sets.

## 5. "Manca" - Kelvin Momo feat. Babalwa M

Kelvin Momo continues to pioneer the soulful, jazz-influenced "private school" Amapiano subgenre with this sophisticated offering.

## 4. "Imithandazo" - Young Stunna, DJ Maphorisa & Kabza De Small feat. Sizwe Alakine & Mashudu

A prayer turned into music, this track showcases Young Stunna's versatile vocal delivery over a perfectly crafted production.

## 3. "Tshwala Bam" - Focalistic & Vigro Deep

This energetic track has spawned countless dance challenges on social media, cementing both artists' reputations as innovators in the scene.

## 2. "Mnike" - DJ Maphorisa, Tyler ICU & Nandipha808 feat. Ceeka RSA & Tyron Dee

With its distinctive vocal sample and irresistible rhythm, "Mnike" has crossed over to international audiences while maintaining its authentic Amapiano essence.

## 1. "Imithandazo" - Kabza De Small & DJ Maphorisa feat. Young Stunna, Nkosazana Daughter & Sizwe Alakine

Taking the top spot is this masterpiece that perfectly balances commercial appeal with underground credibility, showcasing why the Piano Kings continue to lead the genre's evolution.

As Amapiano continues to evolve and influence global music trends, these tracks represent the cutting edge of a sound that shows no signs of slowing down.
      `,
      published: true,
      publishedAt: new Date("2023-06-10"),
      authorId: admin.id,
      categoryId: featureCategory?.id,
    },
  ]

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    })
  }
  console.log(`Created ${articles.length} articles`)

  // Create sample radio shows
  const radioShows = [
    {
      title: "Morning Groove",
      description: "Start your day with the freshest Amapiano tracks",
      startTime: new Date("2023-01-01T06:00:00Z"),
      endTime: new Date("2023-01-01T09:00:00Z"),
      isRecurring: true,
      recurringDays: "1,2,3,4,5", // Monday to Friday
    },
    {
      title: "Amapiano Workday",
      description: "Keep the rhythm going during your work hours",
      startTime: new Date("2023-01-01T09:00:00Z"),
      endTime: new Date("2023-01-01T12:00:00Z"),
      isRecurring: true,
      recurringDays: "1,2,3,4,5", // Monday to Friday
    },
    {
      title: "The Midday Mix",
      description: "Two hours of the freshest Amapiano tracks, exclusive premieres, and special guest interviews",
      startTime: new Date("2023-01-01T12:00:00Z"),
      endTime: new Date("2023-01-01T14:00:00Z"),
      isRecurring: true,
      recurringDays: "1,2,3,4,5", // Monday to Friday
    },
  ]

  for (const show of radioShows) {
    await prisma.radioShow.create({
      data: show,
    })
  }
  console.log(`Created ${radioShows.length} radio shows`)

  // Create sample products
  const products = [
    {
      title: "Amapiano Producer Bundle",
      description: "Complete production toolkit with samples, presets, and video tutorials",
      price: 1499,
      salePrice: 1199,
      inventory: 100,
      imageUrl: "/placeholder.svg?height=400&width=800",
      type: "SAMPLE_PACK",
      published: true,
    },
    {
      title: "Amapiano T-Shirt",
      description: "Premium cotton with custom print",
      price: 349,
      inventory: 50,
      imageUrl: "/placeholder.svg?height=300&width=300",
      type: "MERCH",
      published: true,
    },
    {
      title: "Sunset in Soweto",
      description: "A soulful Amapiano beat with deep log drums and atmospheric piano melodies",
      price: 250,
      inventory: 999,
      imageUrl: "/placeholder.svg?height=400&width=400",
      type: "BEAT",
      published: true,
    },
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }
  console.log(`Created ${products.length} products`)

  console.log("Seeding completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

