import React from "react";

import { Heading, Flex, Text, Button, Avatar, RevealFx, Column, Badge, Row, Meta, Schema } from "@once-ui-system/core";
import { home, about, person, newsletter, baseURL, routes } from "@/resources";
import { Projects } from "@/components/work/Projects";
import { Posts } from "@/components/blog/Posts";
import AIChatbot from "@/components/AIChatbot";

export default function Home() {
  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={`/api/og/generate?title=${encodeURIComponent(home.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column fillWidth paddingY="24" gap="m">
        <Column maxWidth="s">
          {home.featured.display && (
          <RevealFx fillWidth horizontal="start" paddingTop="16" paddingBottom="32" paddingLeft="12">
            <Badge background="brand-alpha-weak" paddingX="12" paddingY="4" onBackground="neutral-strong" textVariant="label-default-s" arrow={false}
              href={home.featured.href}>
              <Row paddingY="2">{home.featured.title}</Row>
            </Badge>
          </RevealFx>
          )}
          <RevealFx translateY="4" fillWidth horizontal="start" paddingBottom="16">
            <Heading wrap="balance" variant="display-strong-l">
              {home.headline}
            </Heading>
          </RevealFx>
          <RevealFx translateY="8" delay={0.2} fillWidth horizontal="start" paddingBottom="32">
            <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-xl">
              {home.subline}
            </Text>
          </RevealFx>
          <RevealFx paddingTop="12" delay={0.4} horizontal="start" paddingLeft="12">
            <Button
              id="about"
              data-border="rounded"
              href={about.path}
              variant="secondary"
              size="m"
              weight="default"
              arrowIcon
            >
              <Flex gap="8" vertical="center" paddingRight="4">
                {about.avatar.display && (
                  <Avatar
                    marginRight="8"
                    style={{ marginLeft: "-0.75rem" }}
                    src={person.avatar}
                    size="m"
                  />
                )}
                {about.title}
              </Flex>
            </Button>
          </RevealFx>
        </Column>
      </Column>
      <RevealFx translateY="16" delay={0.6}>
        <Projects range={[1, 1]} />
      </RevealFx>
      {/* --- New: Tech Stack Section --- */}
      <RevealFx translateY="24" delay={0.8}>
        <Column fillWidth maxWidth="s" gap="l" paddingY="32" horizontal="center" background="surface" radius="l" border="neutral-alpha-weak">
          <Heading as="h2" variant="display-strong-m" wrap="balance" marginBottom="m">
            Tech Stack
          </Heading>
          <Flex gap="16" wrap horizontal="center">
            {/* Example: Add/replace with your real stack */}
            <Avatar src="/images/projects/project-01/cover-02.jpg" size="l" />
            <Avatar src="/images/projects/project-01/cover-04.jpg" size="l" />
            <Avatar src="/images/projects/project-01/cover-03.jpg" size="l" />
            <Avatar src="/images/avatar.jpg" size="l" />
          </Flex>
          <Text variant="body-default-m" onBackground="neutral-weak" align="center">
            Next.js, TypeScript, Python, Node.js, Supabase, Figma, AI/ML, and more.
          </Text>
        </Column>
      </RevealFx>
      {/* --- New: Interactive Section (Stock Prediction/Chatbot) --- */}
      <RevealFx translateY={28} delay={0.9}>
        <Column fillWidth maxWidth="s" gap="l" paddingY="32" horizontal="center" background="surface" radius="l" border="neutral-alpha-weak">
          <Heading as="h2" variant="display-strong-m" wrap="balance" marginBottom="m">
            Try My AI Tools
          </Heading>
          <AIChatbot />
        </Column>
      </RevealFx>
      {/* --- New: Open Source/Contributions Section --- */}
      <RevealFx translateY="32" delay={1.0}>
        <Column fillWidth maxWidth="s" gap="l" paddingY="32" horizontal="center" background="surface" radius="l" border="neutral-alpha-weak">
          <Heading as="h2" variant="display-strong-m" wrap="balance" marginBottom="m">
            Open Source & Community
          </Heading>
          <Text variant="body-default-m" onBackground="neutral-weak" align="center">
            Contributor to open source projects and passionate about building tools for developers and sharing knowledge with the community.
          </Text>
        </Column>
      </RevealFx>
      <Flex fillWidth gap="24" mobileDirection="column">
        <Flex flex={1} paddingLeft="l" paddingTop="24">
          <Heading as="h2" variant="display-strong-xs" wrap="balance">
            Latest from the blog
          </Heading>
        </Flex>
        <Flex flex={3} paddingX="20">
          <Posts range={[1, 2]} columns="2" />
        </Flex>
      </Flex>
      <Projects range={[2]} />
    </Column>
  );
}
