<script setup lang="ts">

import { HiddenControl } from "@ecosystem/core-ui";
import { EventPage } from "@ecosystem/calendar";
import { FormPage } from "@ecosystem/dynamicforms";

</script>
<template>
    <HiddenControl>
        <template #toggleable>
            <FormPage formTypeCode="event"/>
        </template>
        <template #always>
            <EventPage />
        </template>
    </HiddenControl>
</template>