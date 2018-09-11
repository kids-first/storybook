import React from 'react';
import addons from '@storybook/addons';
import { EVENT_ID } from './events';
import LiveEdit from './LiveEdit';

function getLocation(context, locationsMap) {
  return locationsMap[`${context.kind}@${context.story}`] || locationsMap[`@${context.story}`];
}

function setLiveEdit(story, context, source, locationsMap) {
  const channel = addons.getChannel();
  const currentLocation = getLocation(context, locationsMap);

  channel.emit(EVENT_ID, {
    source,
    currentLocation,
    locationsMap,
  });

  return <LiveEdit>{story(context)}</LiveEdit>;
}

export function withLiveEdit(source, locationsMap = {}) {
  return (story, context) => setLiveEdit(story, context, source, locationsMap);
}
