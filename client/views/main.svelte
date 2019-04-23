<div class="render-target" bind:this={rendertarget}></div>

<script>
export let rendertarget;
</script>

<style>
	.render-target {
	  min-height: 0;
	  height: 100%;
	  width: 100%;
	  max-height: 100%;
	  max-width: 100%;
	  overflow: hidden;

	  margin: 0;
	  padding: 0;
	  background-color: black;
	}
</style>