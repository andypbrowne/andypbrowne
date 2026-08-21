<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:atom="http://www.w3.org/2005/Atom"
	exclude-result-prefixes="atom">
	<xsl:output method="html" encoding="UTF-8" indent="yes" doctype-system="about:legacy-compat"/>

	<xsl:template match="/">
		<html lang="en">
			<head>
				<meta charset="utf-8"/>
				<meta name="viewport" content="width=device-width, initial-scale=1"/>
				<meta name="color-scheme" content="light dark"/>
				<title>
					<xsl:value-of select="atom:feed/atom:title"/>
					<xsl:text> feed</xsl:text>
				</title>
				<link rel="stylesheet" href="/css/index.css"/>
				<style>
					h1 {
						text-align: start;
						margin-block: 0 1rem;
					}
					aside {
						max-width: 48em;
					}
					.feed-url {
						display: block;
						overflow-wrap: anywhere;
						font-size: var(--font-size-sm);
					}
					.feed-intro {
						max-width: 48em;
					}
					.feed-list {
						list-style: none;
						padding: 0;
						margin: 0;
					}
				</style>
			</head>
			<body>
				<header>
					<div>
						<a href="/">&#x2190; andypbrowne.com</a>
					</div>
				</header>
				<main>
					<h1>Feed</h1>
					<aside>
						<p>

							This is a feed of new posts. Copy this URL into Feedly, NetNewsWire, or another reader.
							<xsl:text> </xsl:text>
							<a href="https://aboutfeeds.com/">What is a feed?</a>
						</p>
						<p>
							<code class="feed-url">https://andypbrowne.com/feed/feed.xml</code>
						</p>
					</aside>
					<p class="feed-intro">
						Andy is a User Experience Designer who specializes in employee experience and design operations. He likes to say that he brings good order and discipline to the field of design.
					</p>
					<ul class="feed-list">
						<xsl:apply-templates select="atom:feed/atom:entry"/>
					</ul>
				</main>
			</body>
		</html>
	</xsl:template>

	<xsl:template match="atom:entry">
		<li class="like-item">
			<a href="{atom:link/@href}">
				<xsl:value-of select="atom:title"/>
			</a>
			<br/>
			<time class="source" datetime="{substring(atom:updated, 1, 10)}">
				<xsl:call-template name="format-date">
					<xsl:with-param name="date" select="atom:updated"/>
				</xsl:call-template>
			</time>
		</li>
	</xsl:template>

	<xsl:template name="format-date">
		<xsl:param name="date"/>
		<xsl:variable name="month" select="substring($date, 6, 2)"/>
		<xsl:choose>
			<xsl:when test="$month = '01'">January</xsl:when>
			<xsl:when test="$month = '02'">February</xsl:when>
			<xsl:when test="$month = '03'">March</xsl:when>
			<xsl:when test="$month = '04'">April</xsl:when>
			<xsl:when test="$month = '05'">May</xsl:when>
			<xsl:when test="$month = '06'">June</xsl:when>
			<xsl:when test="$month = '07'">July</xsl:when>
			<xsl:when test="$month = '08'">August</xsl:when>
			<xsl:when test="$month = '09'">September</xsl:when>
			<xsl:when test="$month = '10'">October</xsl:when>
			<xsl:when test="$month = '11'">November</xsl:when>
			<xsl:when test="$month = '12'">December</xsl:when>
		</xsl:choose>
		<xsl:text> </xsl:text>
		<xsl:value-of select="substring($date, 1, 4)"/>
	</xsl:template>
</xsl:stylesheet>
