import React from 'react'
import {
	TEXT,
	NUMB,
	TIME,
	BOOL,
	USER,
} from '../../resources/AttributeTypeConstants'
import BoolAndUsersDropDown from './BoolAndUsersDropDown'
import DateTimePickerComp from './DateTimePickerComp'
import Prompt from 'rn-prompt'

export default function RecurrentAttributeEditOrCreatePrompt({ name, type, toggleEditingState, onSubmit }) {
	switch (type) {
		case BOOL:
			return <BoolAndUsersDropDown label={name} type={BOOL} onSubmit={onSubmit} />
		case USER:
			return <BoolAndUsersDropDown label={name} type={USER} onSubmit={onSubmit} />
		case TIME:
			return (
				<DateTimePickerComp
					title={`Edit '${name}'`}
					onDatePicked={onSubmit}
					onCancel={toggleEditingState}
				/>
			)
		default:
			// NUMB or TEXT
			return (
				<Prompt
					textInputProps={type === NUMB ? { keyboardType: 'numeric' } : {}}
					title={`Log a new value for ${name}`}
					placeholder="Enter value"
					defaultValue={''}
					visible={true}
					onCancel={toggleEditingState}
					onSubmit={onSubmit}
				/>
			)
	}
}
