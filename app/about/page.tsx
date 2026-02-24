import type { Metadata } from "next";
import SortBar from "@/components/ui/SortBar";

export const metadata: Metadata = {
  title: "about — tears collector",
};

export default function AboutPage() {
  return (
    <>
      <SortBar />

      <main
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: 100,
          paddingBottom: 80,
        }}
      >
        <article
          style={{
            width: "100%",
            maxWidth: 560,
            padding: "0 32px",
          }}
        >
          {/* App name */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: 38,
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
              color: "var(--ink)",
              marginBottom: 10,
            }}
          >
            tears collector
          </h1>

          {/* Tagline */}
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 11,
              fontWeight: 300,
              letterSpacing: "0.14em",
              color: "var(--ink-35)",
              marginBottom: 52,
              textTransform: "uppercase",
            }}
          >
            a quiet record 
          </p>

          {/* Divider */}
          <div
            style={{ borderTop: "1px solid var(--ink-14)", marginBottom: 44 }}
          />

          {/* What it is */}
          <section style={{ marginBottom: 44 }}>
            <h2
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 10,
                fontWeight: 400,
                letterSpacing: "0.16em",
                color: "var(--ink-60)",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              What this is
            </h2>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: 18,
                lineHeight: 1.8,
                color: "var(--ink-80)",
              }}
            >
              This site is a diary about being laid off. <br></br>
              <br></br>
              I’m a very emotional person, but I’ve never been very good at
              documenting or articulating my feelings. Partly because I’m still
              digesting everything and often feel overwhelmed, and partly
              because my emotions have felt like a roller coaster. There are
              moments when I feel fine — I talk normally, laugh normally, and
              almost forget what happened. But there are also moments when I
              feel anxious, upset, or unsure about what comes next.<br></br>
              <br></br>I know I’m lucky and privileged to believe that this is
              just part of life, and that eventually things will move forward.
              Still, at this point in my life, I often feel lost. So instead of
              trying to write the perfect journal entry, I decided to document
              my feelings in a different way. <br></br>
              <br></br>
              Being laid off made me question my ability, my worth, the value of
              my work, and whether I should stay in this industry at all. But it
              also revealed something else. Friends and family reached out,
              rooted for me, and offered support. Some messages came from people
              I hadn’t expected. I realized that being laid off didn’t only
              bring tears of sadness — there were moments when I cried because I
              felt loved, cared for, and unexpectedly fortunate. Looking back, I
              know this period won’t be colored only in blue or gray. <br></br>
              <br></br>
              According to the company’s email, the rapid development of
              artificial intelligence played a role in my layoff. So I ended up
              using that same technology to build this site — Claude Code and
              Figma Make — in about two days. It felt like an appropriate
              response. <br></br><br></br> 
              If you’d like, feel free to leave a tear here too. The
              password is my dog’s name.
            </p>
          </section>

          {/* Divider */}
          <div
            style={{ borderTop: "1px solid var(--ink-14)", marginBottom: 44 }}
          />

          {/* Privacy */}
          <section style={{ marginBottom: 44 }}>
            <h2
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 10,
                fontWeight: 400,
                letterSpacing: "0.16em",
                color: "var(--ink-60)",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Privacy
            </h2>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: 18,
                lineHeight: 1.8,
                color: "var(--ink-80)",
              }}
            >
              Entries are stored anonymously in a database so they can live on
              the site, but nothing is linked back to you.
            </p>
          </section>

          {/* Tagline */}
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 13,
              fontWeight: 300,
              letterSpacing: "0.14em",
              color: "var(--ink-60)",
              marginBottom: 52,
              textTransform: "uppercase",
            }}
          >
            <a href="https://sabrinamochi.github.io">Check out my portfolio → </a>
          </p>

          
        </article>
      </main>
    </>
  );
}
