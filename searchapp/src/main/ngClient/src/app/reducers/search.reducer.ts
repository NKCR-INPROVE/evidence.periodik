import { ActionReducer, Action } from '@ngrx/store';
import {CurrentSearch} from "../models/current-search.model";

export const SearchReducer: ActionReducer<CurrentSearch> = (state: CurrentSearch, action: Action) => {
    switch (action.type) {
         case 'TEXT':
             return Object.assign({}, state, {
                 name: action.payload.text
             });
         
        case 'ACTUAL':
            return Object.assign({}, state, {
                error: action.payload.message
            });
        default:
            return state;
    }
};