<?php
/**
 * single.php — Single post template.
 * Schema.org Article, related posts by category, comments.
 *
 * @package tso-theme
 */
get_header();

while ( have_posts() ) :
	the_post();

	$tso_post_title    = get_the_title();
	$tso_post_date_iso = get_the_date( 'c' );
	$tso_post_date_mod = get_the_modified_date( 'c' );
	$tso_post_author   = get_the_author();
	$tso_post_excerpt  = get_the_excerpt();
	$tso_post_url      = get_permalink();

	$tso_schema = array(
		'@context'      => 'https://schema.org',
		'@type'         => 'NewsArticle',
		'headline'      => $tso_post_title,
		'description'   => wp_strip_all_tags( $tso_post_excerpt ),
		'datePublished' => $tso_post_date_iso,
		'dateModified'  => $tso_post_date_mod,
		'url'           => $tso_post_url,
		'author'        => array(
			'@type' => 'Person',
			'name'  => $tso_post_author,
		),
		'publisher'     => array(
			'@type' => 'Organization',
			'name'  => get_bloginfo( 'name' ),
			'url'   => home_url( '/' ),
		),
	);

	if ( has_post_thumbnail() ) {
		$tso_thumb_src = wp_get_attachment_image_src( get_post_thumbnail_id(), 'large' );
		if ( $tso_thumb_src ) {
			$tso_schema['image'] = array(
				'@type'  => 'ImageObject',
				'url'    => $tso_thumb_src[0],
				'width'  => (int) $tso_thumb_src[1],
				'height' => (int) $tso_thumb_src[2],
			);
		}
	}
	?>
<script type="application/ld+json"><?php echo wp_json_encode( $tso_schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ); ?></script>

	<?php get_template_part( 'template-parts/single', 'breadcrumb' ); ?>

<div class="single-layout">

	<main id="primary" class="single-content-area" role="main">
		<article id="post-<?php the_ID(); ?>" <?php post_class(); ?> itemscope itemtype="https://schema.org/NewsArticle">

			<?php get_template_part( 'template-parts/single', 'header' ); ?>

			<div class="entry-content" itemprop="articleBody">
				<?php
				the_content();
				wp_link_pages(
					array(
						'before'      => '<div class="page-links">' . esc_html__( 'Páginas:', 'tso-theme' ),
						'after'       => '</div>',
						'link_before' => '<span class="page-number">',
						'link_after'  => '</span>',
					)
				);
				?>
			</div>

			<?php get_template_part( 'template-parts/single', 'tags' ); ?>

		</article>

		<?php get_template_part( 'template-parts/single', 'related' ); ?>

		<?php
		if ( comments_open() || get_comments_number() ) {
			comments_template();
		}
		?>

	</main>

	<?php get_sidebar(); ?>

</div>

	<?php
endwhile;

get_footer();
