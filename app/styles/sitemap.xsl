<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

    <xsl:output method="html" indent="yes"/>

    <!-- Root template -->
    <xsl:template match="/urlset">
        <html>
            <head>
                <title>Styled Sitemap</title>
                <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f4f4f4; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          a { color: #1a0dab; text-decoration: none; }
          a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <h1>Sitemap</h1>
                <table>
                    <tr>
                        <th>URL</th>
                        <th>Last Modified</th>
                        <th>Change Frequency</th>
                    </tr>
                    <xsl:for-each select="url">
                        <tr>
                            <td>
                                <a href="{loc}">
                                    <xsl:value-of select="loc"/>
                                </a>
                            </td>
                            <td>
                                <xsl:value-of select="lastmod"/>
                            </td>
                            <td>
                                <xsl:value-of select="changefreq"/>
                            </td>
                        </tr>
                    </xsl:for-each>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
