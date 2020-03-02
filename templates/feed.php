<?php /** @var \LachlanArthur\SocialDevFeed\Entry[] $entries */ ?>
<ul class="lasdfg-feed-template">
	<?php foreach ( $entries as $entry ) { ?>
		<li>
			<a href="<?= $entry->url ?>" target="_blank">
				<img src="<?= $entry->getThumbnail()->url ?>">
				<div class="caption">
					<div class="title"><?= $entry->title ?></div>
					<div class="date"><?= $entry->datetime->format( 'jS M Y g:i a' ) ?></div>
				</div>
			</a>
		</li>
	<?php } ?>
</ul>
