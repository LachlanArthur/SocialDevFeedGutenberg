<?php /** @var \LachlanArthur\SocialDevFeed\Entry[] $entries */ ?>
<ul class="lasdfg-feed-template">
	<?php foreach ( $entries as $entry ) { ?>
		<li>
			<a href="<?= $entry->url ?>" target="_blank">
				<?php if ( $entry->hasThumbnail() ) { ?>
					<img src="<?= $entry->getThumbnail()->url ?>">
				<?php } ?>
				<div class="caption">
					<div class="title"><?= $entry->title ?></div>
					<div class="date"><?= $entry->datetime->format( 'jS M Y g:i a' ) ?></div>
				</div>
			</a>
		</li>
	<?php } ?>
</ul>
